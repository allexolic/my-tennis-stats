import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { CreateMatchError } from "@/features/matches/application/errors/CreateMatchError";
import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";
import { PrimaryButton } from "@/shared/components";
import { theme } from "@/shared/theme";

import { Card } from "@/shared/components/Card";
import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
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
    <ScreenContainer>
      <ScreenHeader
        title="Nova partida"
        subtitle="Informe o adversário e quem começa sacando."
      />

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
              style={[styles.input, errors.opponentName && styles.inputError]}
              value={value}
            />
          )}
        />

        {errors.opponentName?.message ? (
          <Text style={styles.errorText}>{errors.opponentName.message}</Text>
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

      <Card>
        <View>
          <Text style={styles.cardTitle}>Formato da partida</Text>

          <Text style={styles.cardText}>
            Um set tradicional, com tie-break em 6–6.
          </Text>
        </View>
      </Card>

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: theme.spacing.sm,
  },

  label: {
    ...theme.typography.bodyStrong,

    color: theme.colors.text,
  },

  input: {
    minHeight: theme.components.inputHeight,

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
    ...theme.typography.caption,
    color: theme.colors.danger,
  },

  cardTitle: {
    ...theme.typography.cardTitle,

    color: theme.colors.text,
  },

  cardText: {
    ...theme.typography.body,

    marginTop: theme.spacing.xs,

    color: theme.colors.secondaryText,
  },

  rootError: {
    padding: theme.spacing.md,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.dangerSurface,
  },

  rootErrorText: {
    ...theme.typography.body,

    color: theme.colors.danger,
  },
});
