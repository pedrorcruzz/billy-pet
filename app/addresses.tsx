import { useEffect, useState } from "react";
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
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppModal } from "@/components/AppModal";
import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";
import { SavedAddress } from "@/contexts/LocationContext";
import { useLocation } from "@/hooks/useLocation";

type FormData = SavedAddress;

const EMPTY_FORM: FormData = {
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

const REQUIRED_FIELDS: (keyof FormData)[] = [
  "cep",
  "street",
  "number",
  "neighborhood",
  "city",
  "state",
];

export default function AddressesScreen() {
  const {
    // location,
    loading,
    error,
    requestLocation,
    savedAddress,
    saveAddress,
  } = useLocation();

  const [formData, setFormData] = useState<FormData>(
    savedAddress ?? EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");
  // const onTintColor = useThemeColor("onTint");
  const errorColor = useThemeColor("error");
  const separatorColor = useThemeColor("separator");
  const inputBorderColor = useThemeColor("inputBorder");

  useEffect(() => {
    if (savedAddress) {
      setFormData(savedAddress);
    }
  }, [savedAddress]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleUseCurrentLocation = async () => {
    const result = await requestLocation();
    if (!result) return;

    setFormData((current) => ({
      ...current,
      cep: result.postalCode ?? current.cep,
      street: result.street ?? current.street,
      neighborhood: result.neighborhood ?? current.neighborhood,
      city: result.city ?? current.city,
      state: result.region ?? current.state,
      latitude: result.latitude,
      longitude: result.longitude,
    }));
    setErrors({});
  };

  const handleSave = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    REQUIRED_FIELDS.forEach((field) => {
      const value = formData[field];
      if (typeof value !== "string" || !value.trim()) {
        newErrors[field] = "Obrigatório";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorVisible(true);
      return;
    }

    saveAddress(formData);
    setSuccessVisible(true);
  };

  const showMap = formData.latitude != null && formData.longitude != null;

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
          Endereço de entrega
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
          {showMap && (
            <View style={[styles.mapWrapper, { borderColor: separatorColor }]}>
              <MapView
                style={styles.map}
                region={{
                  latitude: formData.latitude!,
                  longitude: formData.longitude!,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                pointerEvents="none"
              >
                <Marker
                  coordinate={{
                    latitude: formData.latitude!,
                    longitude: formData.longitude!,
                  }}
                  pinColor={Colors.light.tint}
                />
              </MapView>
            </View>
          )}

          <Pressable
            style={[styles.locationButton, { borderColor: tintColor }]}
            onPress={handleUseCurrentLocation}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Usar minha localização atual"
          >
            {loading ? (
              <LoadingSpinner size="small" color={tintColor} inline />
            ) : (
              <Ionicons name="locate" size={20} color={tintColor} />
            )}
            <Text style={[styles.locationButtonText, { color: tintColor }]}>
              {loading ? "Localizando..." : "Usar minha localização atual"}
            </Text>
          </Pressable>

          {error && (
            <View style={[styles.errorBanner, { borderColor: errorColor }]}>
              <Ionicons name="alert-circle" size={20} color={errorColor} />
              <Text style={[styles.errorBannerText, { color: errorColor }]}>
                {error}
              </Text>
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Dados do endereço
          </Text>

          <FormField
            label="CEP"
            value={formData.cep}
            onChangeText={(t) => updateField("cep", t)}
            placeholder="00000-000"
            keyboardType="numeric"
            maxLength={9}
            error={errors.cep}
            textColor={textColor}
            hintColor={hintColor}
            borderColor={inputBorderColor}
            errorColor={errorColor}
            required
          />

          <FormField
            label="Rua"
            value={formData.street}
            onChangeText={(t) => updateField("street", t)}
            placeholder="Av. Brasil"
            error={errors.street}
            textColor={textColor}
            hintColor={hintColor}
            borderColor={inputBorderColor}
            errorColor={errorColor}
            required
          />

          <View style={styles.row}>
            <View style={styles.flex2}>
              <FormField
                label="Número"
                value={formData.number}
                onChangeText={(t) => updateField("number", t)}
                placeholder="123"
                keyboardType="numeric"
                error={errors.number}
                textColor={textColor}
                hintColor={hintColor}
                borderColor={inputBorderColor}
                errorColor={errorColor}
                required
              />
            </View>
            <View style={styles.flex3}>
              <FormField
                label="Complemento"
                value={formData.complement ?? ""}
                onChangeText={(t) => updateField("complement", t)}
                placeholder="Apto, bloco..."
                error={errors.complement}
                textColor={textColor}
                hintColor={hintColor}
                borderColor={inputBorderColor}
                errorColor={errorColor}
              />
            </View>
          </View>

          <FormField
            label="Bairro"
            value={formData.neighborhood}
            onChangeText={(t) => updateField("neighborhood", t)}
            placeholder="Centro"
            error={errors.neighborhood}
            textColor={textColor}
            hintColor={hintColor}
            borderColor={inputBorderColor}
            errorColor={errorColor}
            required
          />

          <View style={styles.row}>
            <View style={styles.flex3}>
              <FormField
                label="Cidade"
                value={formData.city}
                onChangeText={(t) => updateField("city", t)}
                placeholder="Maceió"
                error={errors.city}
                textColor={textColor}
                hintColor={hintColor}
                borderColor={inputBorderColor}
                errorColor={errorColor}
                required
              />
            </View>
            <View style={styles.flex2}>
              <FormField
                label="Estado"
                value={formData.state}
                onChangeText={(t) => updateField("state", t.toUpperCase())}
                placeholder="AL"
                maxLength={2}
                autoCapitalize="characters"
                error={errors.state}
                textColor={textColor}
                hintColor={hintColor}
                borderColor={inputBorderColor}
                errorColor={errorColor}
                required
              />
            </View>
          </View>

          <View style={styles.saveButton}>
            <Button
              title="Salvar endereço"
              onPress={handleSave}
              accessibilityLabel="Salvar endereço"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppModal
        visible={successVisible}
        title="Endereço salvo!"
        message="Seu endereço de entrega foi atualizado com sucesso."
        variant="success"
        icon="checkmark-circle"
        onClose={() => setSuccessVisible(false)}
        buttons={[
          {
            label: "Voltar",
            variant: "primary",
            onPress: () => {
              setSuccessVisible(false);
              router.back();
            },
          },
        ]}
      />

      <AppModal
        visible={errorVisible}
        title="Campos obrigatórios"
        message="Preencha todos os campos marcados antes de salvar."
        variant="danger"
        onClose={() => setErrorVisible(false)}
        buttons={[
          {
            label: "Entendi",
            variant: "primary",
            onPress: () => setErrorVisible(false),
          },
        ]}
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
  required?: boolean;
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
  required,
}: FormFieldProps) {
  const finalBorderColor = error ? errorColor : borderColor;
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: textColor }]}>
        {label}
        {required && <Text style={{ color: errorColor }}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: finalBorderColor,
          },
        ]}
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
  mapWrapper: {
    height: 180,
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: Tokens.spacing.md,
  },
  map: {
    flex: 1,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing.sm,
    borderWidth: 1.5,
    borderRadius: Tokens.radius.md,
    paddingVertical: Tokens.spacing.md,
    minHeight: Tokens.touchTarget,
    marginBottom: Tokens.spacing.md,
  },
  locationButtonText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    marginBottom: Tokens.spacing.md,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
    marginTop: Tokens.spacing.sm,
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
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  saveButton: {
    marginTop: Tokens.spacing.md,
  },
});
