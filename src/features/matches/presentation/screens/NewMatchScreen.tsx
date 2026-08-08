import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CreateMatchError } from "@/features/matches/application/errors/CreateMatchError";
import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";
import { PrimaryButton } from "@/shared/components";
import { theme } from "@/shared/theme";

import { PlayerSideSelector } from "../components/PlayerSideSelector";
import {
    createMatchSchema,
    type CreateMatchFormData,
} from "../validation/createMatchSchema";

export function NewMatchScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateMatchFormData>({
    resolver: zodResolver(createMatchSchema),

    defaultValues: {
      opponentName: "",
      firstServer: "PLAYER",
    },
  });

  async function submit(data: CreateMatchFormData): Promise<void> {
    try {
      const match = await matchDependencies.createMatch.execute({
        opponentName: data.opponentName,
        firstServer: data.firstServer,
      });

      router.replace({
        pathname: "/matches/[matchId]",
        params: {
          matchId: match.id,
        },
      });
    } catch (error) {
      if (error instanceof CreateMatchError) {
        handleCreateMatchError(error);
        return;
      }

      setError("root", {
        type: "server",
        message: "Não foi possível iniciar a partida.",
      });
    }
  }

  function handleCreateMatchError(error: CreateMatchError): void {
    if (error.code === "OPPONENT_NAME_REQUIRED") {
      setError("opponentName", {
        type: "application",
        message: error.message,
      });

      return;
    }

    setError("root", {
      type: "application",
      message: error.message,
    });
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View>
            <Text style={styles.title}>Nova partida</Text>

            <Text style={styles.subtitle}>
              Informe o adversário e quem começa sacando.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome do adversário</Text>

            <Controller
              control={control}
              name="opponentName"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  accessibilityLabel={"Nome do adversário"}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isSubmitting}
                  maxLength={80}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Ex.: João"
                  placeholderTextColor={theme.colors.secondaryText}
                  returnKeyType="done"
                  style={[
                    styles.input,
                    errors.opponentName && styles.inputError,
                  ]}
                  value={value}
                />
              )}
            />

            {errors.opponentName?.message ? (
              <Text style={styles.errorText}>
                {errors.opponentName.message}
              </Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Quem começa sacando?</Text>

            <Controller
              control={control}
              name="firstServer"
              render={({ field: { onChange, value } }) => (
                <PlayerSideSelector
                  disabled={isSubmitting}
                  onChange={onChange}
                  value={value}
                />
              )}
            />

            {errors.firstServer?.message ? (
              <Text style={styles.errorText}>{errors.firstServer.message}</Text>
            ) : null}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Formato da partida</Text>

            <Text style={styles.infoText}>
              Um set tradicional, com tie-break em 6–6.
            </Text>
          </View>

          {errors.root?.message ? (
            <View style={styles.rootError}>
              <Text style={styles.rootErrorText}>{errors.root.message}</Text>
            </View>
          ) : null}

          <PrimaryButton
            title="Iniciar partida"
            loading={isSubmitting}
            onPress={() => {
              void handleSubmit(submit)();
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
  },

  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.secondaryText,
    fontSize: 17,
    lineHeight: 25,
  },

  fieldGroup: {
    gap: theme.spacing.sm,
  },

  label: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    minHeight: 56,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    fontSize: 17,
  },

  inputError: {
    borderColor: theme.colors.danger,
  },

  errorText: {
    color: theme.colors.danger,
    fontSize: 14,
  },

  infoCard: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },

  infoTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  infoText: {
    color: theme.colors.secondaryText,
    fontSize: 15,
    lineHeight: 22,
  },

  rootError: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: "#FEE2E2",
  },

  rootErrorText: {
    color: theme.colors.danger,
    fontSize: 15,
    lineHeight: 22,
  },
});
