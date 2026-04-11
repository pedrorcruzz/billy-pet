import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

import { AppModal, AppModalButton } from "@/components/AppModal";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";
import { useAuth } from "@/hooks/useAuth";

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  onPress: () => void;
  destructive?: boolean;
}

const USER_INFO = {
  name: "Pedro Rosa",
  email: "pedro@gmail.com",
};

interface ModalState {
  visible: boolean;
  title: string;
  message?: string;
  variant?: "default" | "success" | "danger" | "info";
  icon?: keyof typeof Ionicons.glyphMap;
  buttons: AppModalButton[];
}

const HIDDEN_MODAL: ModalState = {
  visible: false,
  title: "",
  buttons: [],
};

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(HIDDEN_MODAL);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const separatorColor = useThemeColor("separator");
  const errorColor = useThemeColor("error");

  const closeModal = () => setModal((current) => ({ ...current, visible: false }));

  const showSoon = (feature: string) => {
    setModal({
      visible: true,
      title: feature,
      message: "Esse recurso estará disponível em breve.",
      variant: "info",
      icon: "construct",
      buttons: [{ label: "Entendi", variant: "primary", onPress: closeModal }],
    });
  };

  const showPermissionError = (kind: "camera" | "gallery") => {
    setModal({
      visible: true,
      title: "Permissão necessária",
      message:
        kind === "camera"
          ? "Permita acesso à câmera nas configurações para tirar uma foto."
          : "Permita acesso à galeria nas configurações para escolher uma foto.",
      variant: "danger",
      buttons: [{ label: "Entendi", variant: "primary", onPress: closeModal }],
    });
  };

  const handleLogout = () => {
    setModal({
      visible: true,
      title: "Sair da conta",
      message: "Tem certeza que deseja encerrar sua sessão?",
      variant: "danger",
      icon: "log-out",
      buttons: [
        { label: "Cancelar", variant: "cancel" },
        {
          label: "Sair",
          variant: "destructive",
          onPress: () => {
            closeModal();
            logout();
            router.replace("/(auth)/login");
          },
        },
      ],
    });
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showPermissionError("gallery");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showPermissionError("camera");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleChangeAvatar = () => {
    const buttons: AppModalButton[] = [
      {
        label: "Tirar foto",
        variant: "secondary",
        onPress: () => {
          closeModal();
          takePhoto();
        },
      },
      {
        label: "Escolher da galeria",
        variant: "secondary",
        onPress: () => {
          closeModal();
          pickFromGallery();
        },
      },
    ];
    if (avatarUri) {
      buttons.push({
        label: "Remover foto atual",
        variant: "destructive",
        onPress: () => {
          closeModal();
          setAvatarUri(null);
        },
      });
    }
    buttons.push({ label: "Cancelar", variant: "cancel" });

    setModal({
      visible: true,
      title: "Foto de perfil",
      message: "Como você quer atualizar sua foto?",
      variant: "default",
      icon: "camera",
      buttons,
    });
  };

  const settings: SettingsItemProps[] = [
    {
      icon: "person-outline",
      label: "Editar perfil",
      description: "Nome, foto e dados pessoais",
      onPress: () => showSoon("Editar perfil"),
    },
    {
      icon: "location-outline",
      label: "Endereços",
      description: "Gerenciar locais de entrega",
      onPress: () => router.push("/addresses"),
    },
    {
      icon: "card-outline",
      label: "Pagamentos",
      description: "Cartões e formas de pagamento",
      onPress: () => showSoon("Pagamentos"),
    },
    {
      icon: "notifications-outline",
      label: "Notificações",
      description: "Preferências de aviso",
      onPress: () => showSoon("Notificações"),
    },
    {
      icon: "lock-closed-outline",
      label: "Privacidade e segurança",
      description: "Senha, dados e permissões",
      onPress: () => showSoon("Privacidade"),
    },
    {
      icon: "help-circle-outline",
      label: "Ajuda e suporte",
      description: "FAQ e atendimento",
      onPress: () => showSoon("Ajuda"),
    },
    {
      icon: "information-circle-outline",
      label: "Sobre o Billy Pet",
      description: "Versão 1.0.0",
      onPress: () => showSoon("Sobre"),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Pressable
            style={[styles.avatarRing, { borderColor: tintColor }]}
            onPress={handleChangeAvatar}
            accessibilityRole="button"
            accessibilityLabel="Alterar foto de perfil"
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: tintColor }]}>
                <Text style={[styles.avatarInitial, { color: onTintColor }]}>
                  {USER_INFO.name.charAt(0)}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.avatarEditBadge,
                { backgroundColor: tintColor, borderColor: backgroundColor },
              ]}
            >
              <Ionicons name="camera" size={16} color={onTintColor} />
            </View>
          </Pressable>

          <Text style={[styles.userName, { color: textColor }]}>
            {USER_INFO.name}
          </Text>
          <Text style={[styles.userEmail, { color: hintColor }]}>
            {USER_INFO.email}
          </Text>
        </View>

        <View style={[styles.settingsCard, { borderColor: separatorColor }]}>
          {settings.map((item, index) => (
            <View key={item.label}>
              <SettingsRow
                {...item}
                textColor={textColor}
                hintColor={hintColor}
                tintColor={tintColor}
              />
              {index < settings.length - 1 && (
                <View
                  style={[styles.rowSeparator, { backgroundColor: separatorColor }]}
                />
              )}
            </View>
          ))}
        </View>

        <Pressable
          style={[styles.logoutButton, { borderColor: errorColor }]}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Ionicons name="log-out-outline" size={22} color={errorColor} />
          <Text style={[styles.logoutText, { color: errorColor }]}>Sair</Text>
        </Pressable>
      </ScrollView>

      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        variant={modal.variant}
        icon={modal.icon}
        buttons={modal.buttons}
        onClose={closeModal}
      />
    </View>
  );
}

interface SettingsRowFullProps extends SettingsItemProps {
  textColor: string;
  hintColor: string;
  tintColor: string;
}

function SettingsRow({
  icon,
  label,
  description,
  onPress,
  textColor,
  hintColor,
  tintColor,
}: SettingsRowFullProps) {
  return (
    <Pressable
      style={styles.settingsRow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.settingsIconWrapper, { backgroundColor: tintColor + "1A" }]}>
        <Ionicons name={icon} size={22} color={tintColor} />
      </View>
      <View style={styles.settingsText}>
        <Text style={[styles.settingsLabel, { color: textColor }]}>{label}</Text>
        {description && (
          <Text style={[styles.settingsDescription, { color: hintColor }]}>
            {description}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={hintColor} />
    </Pressable>
  );
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.lg,
    paddingBottom: 140,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: Tokens.spacing.xl,
  },
  avatarRing: {
    width: AVATAR_SIZE + 8,
    height: AVATAR_SIZE + 8,
    borderRadius: (AVATAR_SIZE + 8) / 2,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Tokens.spacing.md,
    position: "relative",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  userName: {
    fontSize: Tokens.typography.h2,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  userEmail: {
    fontSize: Tokens.typography.body,
    marginTop: 2,
  },
  settingsCard: {
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    overflow: "hidden",
    backgroundColor: Colors.light.background,
    marginBottom: Tokens.spacing.lg,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Tokens.spacing.md,
    paddingHorizontal: Tokens.spacing.md,
    gap: Tokens.spacing.md,
    minHeight: Tokens.touchTarget + 8,
  },
  settingsIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsText: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  settingsDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  rowSeparator: {
    height: 1,
    marginLeft: Tokens.spacing.md + 40 + Tokens.spacing.md,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing.sm,
    borderWidth: 1.5,
    borderRadius: Tokens.radius.md,
    paddingVertical: Tokens.spacing.md,
    minHeight: Tokens.touchTarget,
  },
  logoutText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
});
