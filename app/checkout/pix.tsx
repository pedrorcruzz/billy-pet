import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppModal } from "@/components/AppModal";
import { Button } from "@/components/Button";
import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

const MOCK_PIX_CODE =
  "00020126580014BR.GOV.BCB.PIX0136billy-pet-mock-9f3c-4d72-bd2a52040000530398654041.005802BR5913BILLY PET LTDA6009MACEIO62070503***6304ABCD";

export default function PixCheckoutScreen() {
  const { totalPrice } = useCart();
  const [copied, setCopied] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const separatorColor = useThemeColor("separator");
  const borderColor = useThemeColor("cardBorderSubtle");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setConfirmVisible(true);
  };

  const handleConfirmYes = () => {
    setConfirmVisible(false);
    router.push({ pathname: "/checkout/processing", params: { method: "pix" } });
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
          Pagar com PIX
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.amountCard, { borderColor }]}>
          <Text style={[styles.amountLabel, { color: hintColor }]}>
            Valor a pagar
          </Text>
          <Text style={[styles.amountValue, { color: tintColor }]}>
            {formatPrice(totalPrice)}
          </Text>
        </View>

        <View style={[styles.qrCard, { borderColor }]}>
          <Text style={[styles.qrTitle, { color: textColor }]}>
            QR Code PIX
          </Text>
          <Text style={[styles.qrSubtitle, { color: hintColor }]}>
            Aponte a câmera do seu banco
          </Text>

          <View style={[styles.qrPlaceholder, { borderColor: textColor }]}>
            <FakeQrCode color={textColor} backgroundColor={backgroundColor} />
          </View>

          <Pressable
            style={[
              styles.copyButton,
              { borderColor: tintColor, backgroundColor: copied ? tintColor : "transparent" },
            ]}
            onPress={handleCopy}
            accessibilityRole="button"
            accessibilityLabel="Copiar código PIX"
          >
            <Ionicons
              name={copied ? "checkmark" : "copy"}
              size={18}
              color={copied ? onTintColor : tintColor}
            />
            <Text
              style={[
                styles.copyButtonText,
                { color: copied ? onTintColor : tintColor },
              ]}
            >
              {copied ? "Código copiado!" : "Copiar código PIX"}
            </Text>
          </Pressable>

          <Text
            style={[styles.codeText, { color: hintColor }]}
            numberOfLines={2}
          >
            {MOCK_PIX_CODE}
          </Text>
        </View>

        <View style={[styles.barcodeCard, { borderColor }]}>
          <Text style={[styles.qrTitle, { color: textColor }]}>
            Código de barras
          </Text>
          <Text style={[styles.qrSubtitle, { color: hintColor }]}>
            Use no app do seu banco
          </Text>
          <FakeBarcode color={textColor} />
          <Text style={[styles.barcodeText, { color: hintColor }]}>
            34191.79001 01043.510047 91020.150008 4 99410000010000
          </Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: separatorColor }]}>
          <Ionicons name="information-circle" size={20} color={tintColor} />
          <Text style={[styles.infoText, { color: textColor }]}>
            Após realizar o pagamento, toque em "Já paguei" para confirmar e
            iniciar a preparação do seu pedido.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor, borderTopColor: separatorColor },
        ]}
      >
        <Button
          title="Já paguei"
          onPress={handleConfirm}
          accessibilityLabel="Já paguei o PIX"
        />
      </View>

      <AppModal
        visible={confirmVisible}
        title="Confirmar pagamento"
        message="Confirma que o pagamento PIX foi realizado?"
        icon="qr-code"
        variant="success"
        onClose={() => setConfirmVisible(false)}
        buttons={[
          { label: "Cancelar", variant: "cancel" },
          { label: "Confirmar", variant: "primary", onPress: handleConfirmYes },
        ]}
      />
    </SafeAreaView>
  );
}

interface FakeQrCodeProps {
  color: string;
  backgroundColor: string;
}

// QR code visual feito com Views — apenas para simulação.
function FakeQrCode({ color, backgroundColor }: FakeQrCodeProps) {
  const GRID_SIZE = 9;
  const CELL_SIZE = 22;

  // Padrão fixo para parecer um QR (não é um QR real, só visual).
  const PATTERN: (0 | 1)[][] = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1],
  ];

  return (
    <View
      style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        backgroundColor,
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {PATTERN.flatMap((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <View
            key={`${rowIdx}-${colIdx}`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: cell ? color : backgroundColor,
            }}
          />
        )),
      )}
    </View>
  );
}

interface FakeBarcodeProps {
  color: string;
}

// Código de barras visual — barras de larguras variadas para parecer real.
function FakeBarcode({ color }: FakeBarcodeProps) {
  const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 2];
  return (
    <View style={styles.barcodeBars}>
      {BARS.map((width, index) => (
        <View
          key={index}
          style={{
            width: width * 2,
            height: 70,
            backgroundColor: index % 2 === 0 ? color : "transparent",
            marginHorizontal: 1,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    gap: Tokens.spacing.md,
  },
  amountCard: {
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 13,
    marginBottom: Tokens.spacing.xs,
  },
  amountValue: {
    fontSize: Tokens.typography.h1,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  qrCard: {
    borderWidth: 1,
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.lg,
    alignItems: "center",
    gap: Tokens.spacing.sm,
  },
  qrTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  qrSubtitle: {
    fontSize: 13,
  },
  qrPlaceholder: {
    padding: Tokens.spacing.md,
    borderWidth: 2,
    borderRadius: Tokens.radius.md,
    marginVertical: Tokens.spacing.sm,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
    borderWidth: 1.5,
    borderRadius: Tokens.radius.lg,
    paddingHorizontal: Tokens.spacing.lg,
    paddingVertical: Tokens.spacing.sm,
    minHeight: Tokens.touchTarget,
    marginTop: Tokens.spacing.sm,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  codeText: {
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: Tokens.spacing.sm,
    marginTop: Tokens.spacing.xs,
  },
  barcodeCard: {
    borderWidth: 1,
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.lg,
    alignItems: "center",
    gap: Tokens.spacing.sm,
  },
  barcodeBars: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Tokens.spacing.md,
  },
  barcodeText: {
    fontSize: 12,
    textAlign: "center",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
  },
  footer: {
    padding: Tokens.spacing.lg,
    borderTopWidth: 1,
  },
});
