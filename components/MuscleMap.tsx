import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { backSvg, frontSvg } from "../assets/images/body-svgs";

const DEFAULT_COLOR = "transparent";
const TARGET_COLOR = "#e75480";
const SECONDARY_COLOR = "#f4a7c1";

type Props = {
  targetMuscles: string[];
  secondaryMuscles?: string[];
};

function highlightMuscles(
  svgString: string,
  targetMuscles: string[],
  secondaryMuscles: string[],
): string {
  let result = svgString;

  result = result.replace(/\s*class="[^"]*"/g, "");

  result = result.replace(/fill="currentColor"/g, `fill="${DEFAULT_COLOR}"`);

  for (const muscle of targetMuscles) {
    const regex = new RegExp(
      `(<g\\s+id="${muscle}"[^>]*>)([\\s\\S]*?)(</g>)`,
      "g",
    );
    result = result.replace(regex, (_match, open, content, close) => {
      const highlighted = content.replace(
        /fill="[^"]*"/g,
        `fill="${TARGET_COLOR}"`,
      );
      return `${open}${highlighted}${close}`;
    });
  }

  for (const muscle of secondaryMuscles) {
    if (targetMuscles.includes(muscle)) continue;
    const regex = new RegExp(
      `(<g\\s+id="${muscle}"[^>]*>)([\\s\\S]*?)(</g>)`,
      "g",
    );
    result = result.replace(regex, (_match, open, content, close) => {
      const highlighted = content.replace(
        /fill="[^"]*"/g,
        `fill="${SECONDARY_COLOR}"`,
      );
      return `${open}${highlighted}${close}`;
    });
  }

  return result;
}

export default function MuscleMap({
  targetMuscles,
  secondaryMuscles = [],
}: Props) {
  const frontXml = useMemo(
    () => highlightMuscles(frontSvg, targetMuscles, secondaryMuscles),
    [targetMuscles, secondaryMuscles],
  );
  const backXml = useMemo(
    () => highlightMuscles(backSvg, targetMuscles, secondaryMuscles),
    [targetMuscles, secondaryMuscles],
  );

  return (
    <View style={styles.container}>
      <SvgXml xml={frontXml} width="48%" height="100%" />
      <SvgXml xml={backXml} width="48%" height="100%" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 300,
  },
});
