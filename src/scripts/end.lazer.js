import { bigText } from "../components/BigText";

const part = async () => {
  const text = bigText("Congratulations!", { sup: "The end for now..." });
  await text.fadeIn(5000);
  text.remove();
};

export default part;
