import { bigText } from "../components/BigText";

export const checkpoint = async ({ wait }) => {
  const checkpoint = bigText("Checkpoint", { color: "#FFFFFF" });
  await checkpoint.show();
  await wait(500);
  checkpoint.fadeOut(1000).then(() => checkpoint.remove());
};
