import userRepository from "../repository/user/user.repository";

async function run() {
  try {
    const user = await userRepository.findByUid(
      "7bac1c8a-b026-463b-a988-ea29468010c4"
    );
    console.log("User data from the script:", user);
  } catch (err) {
    console.error("Error fetching user:", err);
  }
}

run();
