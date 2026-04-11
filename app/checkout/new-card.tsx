import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppModal } from "@/components/AppModal";
import { Button } from "@/components/Button";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

interface CardForm {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
}

const EMPTY_FORM: CardForm = {
  number: "",
  holder: "",
  expiry: "",
  cvv: "",
};

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export default function NewCardScreen() {
  const { totalPrice } = useCart();

  const [form, setForm] = useState<CardForm>(EMPTY_FORM);
  const [saveCard, setSaveCard] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof CardForm, string>>>({});
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const errorColor = useThemeColor("error");
  const separatorColor = useThemeColor("separator");
  const inputBorderColor = useThemeColor("inputBorder");
  const borderColor = useThemeColor("cardBorderSubtle");

  const updateField = (field: keyof CardForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CardForm, string>> = {};

    const numberDigits = form.number.replace(/\s/g, "");
    if (numberDigits.length < 13) newErrors.number = "Número inválido";

    if (form.holder.trim().length < 3) newErrors.holder = "Nome muito curto";

    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = "Use MM/AA";
    }

    if (form.cvv.length < 3) newErrors.cvv = "CVV inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      setErrorModalVisible(true);
      return;
    }
    router.push({
      pathname: "/checkout/processing",
      params: { method: "debit" },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.header, { borderBottomColor: separatorColor }]}>
        <Pressable
          style={styles.headerButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={26} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Novo cartão de débito
        </Text>
        <View style={styles.headerButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.cardPreview, { backgroundColor: tintColor }]}>
            <View style={styles.cardChip} />
            <Text style={[styles.cardNumber, { color: onTintColor }]}>
              {form.number || "•••• •••• •••• ••••"}
            </Text>
            <View style={styles.cardFooter}>
              <View style={styles.cardFooterCol}>
                <Text style={[styles.cardLabel, { color: onTintColor }]}>
                  TITULAR
                </Text>
                <Text
                  style={[styles.cardValue, { color: onTintColor }]}
                  numberOfLines={1}
                >
                  {form.holder.toUpperCase() || "SEU NOME"}
                </Text>
              </View>
              <View style={styles.cardFooterCol}>
                <Text style={[styles.cardLabel, { color: onTintColor }]}>
                  VALIDADE
                </Text>
                <Text style={[styles.cardValue, { color: onTintColor }]}>
                  {form.expiry || "MM/AA"}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.amountCard, { borderColor }]}>
            <Text style={[styles.amountLabel, { color: hintColor }]}>
              Total a pagar
            </Text>
            <Text style={[styles.amountValue, { color: tintColor }]}>
              {formatPrice(totalPrice)}
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Dados do cartão
          </Text>

          <FormField
            label="Número do cartão"
            value={form.number}
            onChangeText={(t) => updateField("number", formatCardNumber(t))}
            placeholder="0000 0000 0000 0000"
            keyboardType="numeric"
            maxLength={19}
            error={errors.number}
            textColor={textColor}
            hintColor={hintColor}
            borderColor={inputBorderColor}
            errorColor={errorColor}
          />

          <FormField
            label="Nome do titular"
            value={form.holder}
            onChangeText={(t) => updateField("holder", t)}
            placeholder="Como impresso no cartão"
            autoCapitalize="characters"
            error={errors.holder}
            textColor={textColor}
            hintColor={hintColor}
            borderColor={inputBorderColor}
            errorColor={errorColor}
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <FormField
                label="Validade"
                value={form.expiry}
                onChangeText={(t) => updateField("expiry", formatExpiry(t))}
                placeholder="MM/AA"
                keyboardType="numeric"
                maxLength={5}
                error={errors.expiry}
                textColor={textColor}
                hintColor={hintColor}
                borderColor={inputBorderColor}
                errorColor={errorColor}
              />
            </View>
            <View style={styles.flex1}>
              <FormField
                label="CVV"
                value={form.cvv}
                onChangeText={(t) =>
                  updateField("cvv", t.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="123"
                keyboardType="numeric"
                maxLength={4}
                error={errors.cvv}
                textColor={textColor}
                hintColor={hintColor}
                borderColor={inputBorderColor}
                errorColor={errorColor}
              />
            </View>
          </View>

          <Pressable
            style={styles.saveCardRow}
            onPress={() => setSaveCard((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: saveCard }}
            accessibilityLabel="Salvar cartão para próximas compras"
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: saveCard ? tintColor : inputBorderColor,
                  backgroundColor: saveCard ? tintColor : "transparent",
                },
              ]}
            >
              {saveCard && (
                <Ionicons name="checkmark" size={16} color={onTintColor} />
              )}
            </View>
            <Text style={[styles.saveCardText, { color: textColor }]}>
              Salvar cartão para próximas compras
            </Text>
          </Pressable>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { backgroundColor, borderTopColor: separatorColor },
          ]}
        >
          <Button
            title={`Pagar ${formatPrice(totalPrice)}`}
            onPress={handleSubmit}
            accessibilityLabel="Confirmar pagamento com cartão de débito"
          />
        </View>
      </KeyboardAvoidingView>

      <AppModal
        visible={errorModalVisible}
        title="Dados incompletos"
        message="Verifique os campos destacados e tente novamente."
        variant="danger"
        onClose={() => setErrorModalVisible(false)}
        buttons={[{ label: "Entendi", variant: "primary", onPress: () => setErrorModalVisible(false) }]}
      />
    </SafeAreaView>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  maxLength?: number;
  autoCapitalize?: "none" | "characters" | "words";
  error?: string;
  textColor: string;
  hintColor: string;
  borderColor: string;
  errorColor: string;
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
  autoCapitalize,
  error,
  textColor,
  hintColor,
  borderColor,
  errorColor,
}: FormFieldProps) {
  const finalBorderColor = error ? errorColor : borderColor;
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: textColor }]}>{label}</Text>
      <TextInput
        style={[styles.input, { color: textColor, borderColor: finalBorderColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={hintColor}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={label}
      />
      {error && (
        <Text style={[styles.fieldError, { color: errorColor }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: Tokens.touchTarget,
    height: Tokens.touchTarget,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  scrollContent: {
    padding: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing.xl * 2,
  },
  cardPreview: {
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.lg,
    minHeight: 180,
    justifyContent: "space-between",
    marginBottom: Tokens.spacing.md,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardChip: {
    width: 40,
    height: 30,
    borderRadius: 6,
    backgroundColor: Colors.light.cardChipOverlay,
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: Tokens.typography.fontWeight.bold,
    letterSpacing: 2,
    marginVertical: Tokens.spacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardFooterCol: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  amountCard: {
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    alignItems: "center",
    marginBottom: Tokens.spacing.lg,
  },
  amountLabel: {
    fontSize: 13,
    marginBottom: Tokens.spacing.xs,
  },
  amountValue: {
    fontSize: Tokens.typography.h2,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  sectionTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
    marginBottom: Tokens.spacing.md,
  },
  field: {
    marginBottom: Tokens.spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.semibold,
    marginBottom: Tokens.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.sm,
    fontSize: Tokens.typography.body,
    minHeight: Tokens.touchTarget,
  },
  fieldError: {
    fontSize: 12,
    marginTop: Tokens.spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: Tokens.spacing.md,
  },
  saveCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
    marginTop: Tokens.spacing.sm,
    paddingVertical: Tokens.spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  saveCardText: {
    fontSize: 14,
  },
  footer: {
    padding: Tokens.spacing.lg,
    borderTopWidth: 1,
  },
});
