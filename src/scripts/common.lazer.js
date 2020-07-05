import { bigText } from "src/components/BigText";

export const checkpoint = async ({ wait }) => {
  const checkpoint = bigText("Checkpoint", { color: "#00AA00" });
  await checkpoint.show();
  await wait(500);
  checkpoint.fadeOut(1000).then(() => checkpoint.remove());
};
