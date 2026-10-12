const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Same as ChatApp._getChatCode: hash of the two addresses, lower one first.
const chatCode = (a, b) => {
  const [low, high] = BigInt(a) < BigInt(b) ? [a, b] : [b, a];
  return ethers.solidityPackedKeccak256(["address", "address"], [low, high]);
};

describe("ChatApp", function () {
  async function deployFixture() {
    const [alice, bob, carol] = await ethers.getSigners();
    const chatApp = await ethers.deployContract("ChatApp");
    return { chatApp, alice, bob, carol };
  }

  async function friendsFixture() {
    const fixture = await deployFixture();
    const { chatApp, alice, bob } = fixture;
    await chatApp.connect(alice).createAccount("alice");
    await chatApp.connect(bob).createAccount("bob");
    await chatApp.connect(alice).addFriend(bob.address, "bob");
    return fixture;
  }

  describe("accounts", function () {
    it("creates an account and rewards 5 tokens", async function () {
      const { chatApp, alice } = await loadFixture(deployFixture);
      await chatApp.connect(alice).createAccount("alice");

      expect(await chatApp.checkUserExists(alice.address)).to.equal(true);
      expect(await chatApp.getUsername(alice.address)).to.equal("alice");
      expect(await chatApp.minerReward(alice.address)).to.equal(5n);

      const users = await chatApp.getAllAppUser();
      expect(users.map((u) => [u.name, u.accountAddress])).to.deep.equal([
        ["alice", alice.address],
      ]);
    });

    it("rejects an empty name and a second account", async function () {
      const { chatApp, alice } = await loadFixture(deployFixture);
      await expect(chatApp.connect(alice).createAccount("")).to.be.revertedWith(
        "Username cannot be empty"
      );
      await chatApp.connect(alice).createAccount("alice");
      await expect(
        chatApp.connect(alice).createAccount("again")
      ).to.be.revertedWith("User already exists");
    });

    it("reverts getUsername for an unregistered address", async function () {
      const { chatApp, bob } = await loadFixture(deployFixture);
      await expect(chatApp.getUsername(bob.address)).to.be.revertedWith(
        "User is not registered"
      );
    });
  });

  describe("friends", function () {
    it("adds the friendship both ways and rewards both", async function () {
      const { chatApp, alice, bob } = await loadFixture(friendsFixture);

      const aliceFriends = await chatApp.connect(alice).getMyFriendList();
      const bobFriends = await chatApp.connect(bob).getMyFriendList();
      expect(aliceFriends.map((f) => [f.name, f.pubkey])).to.deep.equal([
        ["bob", bob.address],
      ]);
      expect(bobFriends.map((f) => [f.name, f.pubkey])).to.deep.equal([
        ["alice", alice.address],
      ]);
      expect(await chatApp.minerReward(alice.address)).to.equal(6n);
      expect(await chatApp.minerReward(bob.address)).to.equal(6n);
    });

    it("rejects self, duplicate and unregistered friends", async function () {
      const { chatApp, alice, bob, carol } = await loadFixture(friendsFixture);
      await expect(
        chatApp.connect(alice).addFriend(alice.address, "me")
      ).to.be.revertedWith("Users cannot add themeselves as friends");
      await expect(
        chatApp.connect(bob).addFriend(alice.address, "alice")
      ).to.be.revertedWith("These users are already friends");
      await expect(
        chatApp.connect(alice).addFriend(carol.address, "carol")
      ).to.be.revertedWith("User is not registered!");
      await expect(
        chatApp.connect(carol).addFriend(alice.address, "alice")
      ).to.be.revertedWith("Create an account first");
    });
  });

  describe("messages", function () {
    it("stores messages in one shared chat, oldest first", async function () {
      const { chatApp, alice, bob } = await loadFixture(friendsFixture);
      await chatApp.connect(alice).sendMessage(bob.address, "hi bob");
      await chatApp.connect(bob).sendMessage(alice.address, "hi alice");

      const fromAlice = await chatApp.connect(alice).readMessage(bob.address);
      const fromBob = await chatApp.connect(bob).readMessage(alice.address);
      expect(fromAlice.map((m) => [m.sender, m.msg])).to.deep.equal([
        [alice.address, "hi bob"],
        [bob.address, "hi alice"],
      ]);
      expect(fromBob.map((m) => m.msg)).to.deep.equal(
        fromAlice.map((m) => m.msg)
      );
      expect(await chatApp.minerReward(alice.address)).to.equal(8n);
    });

    it("rejects messages between non-friends", async function () {
      const { chatApp, alice, carol } = await loadFixture(friendsFixture);
      await chatApp.connect(carol).createAccount("carol");
      await expect(
        chatApp.connect(alice).sendMessage(carol.address, "hello")
      ).to.be.revertedWith("You are not friend with the given user");
    });
  });

  describe("mining", function () {
    it("returns false and rewards nothing when the chat is empty", async function () {
      const { chatApp, alice, bob } = await loadFixture(friendsFixture);
      await expect(chatApp.connect(alice).mineMessageSafe(bob.address, 1))
        .to.emit(chatApp, "MiningResult")
        .withArgs(alice.address, false, ethers.ZeroHash);
      expect(await chatApp.minerReward(alice.address)).to.equal(6n);
    });

    it("rewards a nonce whose hash is below the difficulty", async function () {
      const { chatApp, alice, bob } = await loadFixture(friendsFixture);
      await chatApp.connect(alice).sendMessage(bob.address, "mine me");

      const [last] = (await chatApp.connect(alice).readMessage(bob.address)).slice(-1);
      const code = chatCode(alice.address, bob.address);
      const difficulty = await chatApp.difficulty();

      let nonce = 0n;
      while (
        BigInt(
          ethers.solidityPackedKeccak256(
            ["bytes32", "string", "uint256", "uint256"],
            [code, last.msg, last.timestamp, nonce]
          )
        ) >= difficulty
      ) {
        nonce++;
      }

      const before = await chatApp.minerReward(alice.address);
      await expect(chatApp.connect(alice).mineMessageSafe(bob.address, nonce))
        .to.emit(chatApp, "MiningResult")
        .withArgs(alice.address, true, ethers.solidityPackedKeccak256(
          ["bytes32", "string", "uint256", "uint256"],
          [code, last.msg, last.timestamp, nonce]
        ));
      expect(await chatApp.minerReward(alice.address)).to.equal(before + 1n);
    });
  });
});
