import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

type Step = {
  heading: string;
  description: string;
  type: "number" | "select" | "multiselect";
  unitToggle?: [string, string];
  options?: string[];
};

const STEPS: Step[] = [
  {
    heading: "How old are you?",
    description: "Your age affects your metabolism and calorie needs.",
    type: "number",
  },
  {
    heading: "What's your gender?",
    description: "This will be used to calibrate your custom plan.",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  {
    heading: "What's your current weight?",
    description:
      "We need this to calculate your maintenance calories accurately.",
    type: "number",
    unitToggle: ["kg", "lbs"],
  },
  {
    heading: "What's your goal weight?",
    description:
      "Your target — this tells us how aggressive your cut or bulk should be.",
    type: "number",
    unitToggle: ["kg", "lbs"],
  },
  {
    heading: "In how many months do you want to reach it?",
    description: "This helps us set a realistic weekly rate of change for you.",
    type: "number",
  },
  {
    heading: "What's your height?",
    description:
      "Combined with weight, this gives us your baseline calorie needs.",
    type: "number",
    unitToggle: ["cm", "ft"],
  },
  {
    heading: "How active are you apart from gym?",
    description:
      "Your job and daily movement affects your total calorie burn significantly.",
    type: "select",
    options: [
      "Mostly sitting (desk job / student)",
      "Lightly active (some walking)",
      "Moderately active (on my feet a lot)",
      "Very active (physical job)",
    ],
  },
  {
    heading: "What is your training split?",
    description: "We'll structure your workout tracking around this.",
    type: "select",
    options: [
      "Push Pull Legs",
      "Upper / Lower",
      "Bro Split",
      "Full Body",
      "I don't have one yet",
    ],
  },
  {
    heading: "How many days do you train weekly?",
    description: "Helps us set your weekly workout targets and streak goals.",
    type: "select",
    options: ["3 days", "4 days", "5 days", "6 days"],
  },
  {
    heading: "What's your experience level?",
    description:
      "Determines how fast we expect your progress and how we track your lifts.",
    type: "select",
    options: [
      "Beginner (under 1 year)",
      "Intermediate (1–3 years)",
      "Advanced (3+ years)",
    ],
  },
  {
    heading: "What's your skin type?",
    description:
      "Every skincare recommendation in MogOS will be filtered by this.",
    type: "select",
    options: ["Oily", "Dry", "Combination", "Sensitive", "I don't know yet"],
  },
  {
    heading: "What are your skin concerns?",
    description:
      "Select all that apply — MogOS will tailor recommendations around these.",
    type: "multiselect",
    options: [
      "Active acne",
      "Blackheads & whiteheads",
      "Acne scars (red/dark marks)",
      "Strawberry skin",
      "Rough/bumpy texture",
      "Oily & congested skin",
      "Melasma (dark patches)",
      "Hyperpigmentation (dark spots)",
      "Uneven skin tone",
      "Sun damage",
    ],
  },
  {
    heading: "Do you currently have a skincare routine?",
    description:
      "So we know whether to guide you from scratch or build on what you have.",
    type: "select",
    options: ["I don't have a skincare routine", "I follow a skincare routine"],
  },
];

function NumberInput({
  value,
  unitToggle,
  onChangeValue,
}: {
  value: string;
  unitToggle?: [string, string];
  onChangeValue: (text: string) => void;
}) {
  const inputRef = useRef<TextInput>(null);
  const [unit, setUnit] = useState(unitToggle?.[0]);

  function toggleUnit() {
    if (!unitToggle) return;
    setUnit((prev) => (prev === unitToggle[0] ? unitToggle[1] : unitToggle[0]));
  }

  return (
    <View style={styles.numberInputArea}>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.numberInput}
          value={value}
          onChangeText={(text) => onChangeValue(text.replace(/[^0-9.]/g, ""))}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#bbb"
          autoFocus
        />
        {unitToggle && (
          <TouchableOpacity style={styles.unitToggle} onPress={toggleUnit}>
            <Text style={styles.unitText}>{unit}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputUnderline} />
    </View>
  );
}

function SelectInput({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}) {
  return (
    <View style={styles.optionsArea}>
      {options.map((option, index) => {
        const isSelected = selected === option;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              isSelected && styles.optionButtonSelected,
            ]}
            onPress={() => onSelect(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MultiSelectInput({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <View style={styles.optionsArea}>
      {options.map((option, index) => {
        const isSelected = selected.includes(option);
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              isSelected && styles.optionButtonSelected,
            ]}
            onPress={() => onToggle(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Onboarding() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const step = STEPS[currentStep];
  const progress = (currentStep + 1) / STEPS.length;
  const currentAnswer = answers[currentStep] || "";
  const isLastStep = currentStep === STEPS.length - 1;

  const canContinue =
    step.type === "multiselect"
      ? currentAnswer.length > 0
      : step.type === "select"
        ? !!currentAnswer
        : currentAnswer.length > 0 && !isNaN(Number(currentAnswer));

  const { mutate: saveOnboarding, isPending: saving } = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const onboardingData = {
        age: Number(answers[0]),
        gender: answers[1],
        current_weight: Number(answers[2]),
        goal_weight: Number(answers[3]),
        timeline_months: Number(answers[4]),
        height: Number(answers[5]),
        activity_level: answers[6],
        training_split: answers[7],
        training_frequency: answers[8],
        experience_level: answers[9],
        skin_type: answers[10],
        skin_concerns: answers[11] ? answers[11].split("||") : [],
        has_skincare_routine: answers[12] === "I follow a skincare routine",
      };

      const { error } = await supabase
        .from("users")
        .update({ onboarding_data: onboardingData })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["auth"] });
      router.replace("/");
    },
    onError: () => {
      Alert.alert("Error", "Failed to save. Please try again.");
    },
  });

  function handleNext() {
    if (!canContinue) return;
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    } else {
      saveOnboarding();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View style={styles.header}>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>{step.heading}</Text>
          <Text style={styles.description}>{step.description}</Text>

          {step.type === "number" ? (
            <NumberInput
              key={currentStep}
              value={currentAnswer}
              unitToggle={step.unitToggle}
              onChangeValue={(text) =>
                setAnswers({ ...answers, [currentStep]: text })
              }
            />
          ) : step.type === "multiselect" ? (
            <MultiSelectInput
              key={currentStep}
              options={step.options!}
              selected={currentAnswer ? currentAnswer.split("||") : []}
              onToggle={(option) => {
                const current = currentAnswer ? currentAnswer.split("||") : [];
                const updated = current.includes(option)
                  ? current.filter((o) => o !== option)
                  : [...current, option];
                setAnswers({ ...answers, [currentStep]: updated.join("||") });
              }}
            />
          ) : (
            <SelectInput
              key={currentStep}
              options={step.options!}
              selected={currentAnswer}
              onSelect={(option) =>
                setAnswers({ ...answers, [currentStep]: option })
              }
            />
          )}
        </ScrollView>

        <View style={styles.footer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.prevButton}
              onPress={() => setCurrentStep(currentStep - 1)}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color="#1A1A2E" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!canContinue || saving) && styles.continueButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canContinue || saving}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.continueText,
                (!canContinue || saving) && styles.continueTextDisabled,
              ]}
            >
              {saving ? "Loading..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#E8E8E8",
    borderRadius: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#000",
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    lineHeight: 34,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 40,
  },
  numberInputArea: {
    marginTop: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  numberInput: {
    fontSize: 48,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    paddingVertical: 8,
  },
  unitToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 4,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  inputUnderline: {
    height: 2,
    backgroundColor: "#000",
    marginTop: 4,
  },
  optionsArea: {
    gap: 12,
  },
  optionButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: "#000",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  optionTextSelected: {
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 8,
    gap: 8,
  },
  prevButton: {
    width: 72,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#1A1A2E",
    backgroundColor: "transparent",
  },
  continueButton: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  continueText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  continueTextDisabled: {
    color: "#999",
  },
});
