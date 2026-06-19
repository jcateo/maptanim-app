import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingHorizontal: 0,
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingRight: 20,
    paddingTop: 10,
  },
  menuItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  logoutText: {
    color: '#dc2626',
  },
  emptySpace: {
    flex: 1,
  },
});

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export default function HamburgerMenu({ visible, onClose, onNavigate, onLogout }: HamburgerMenuProps) {
  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={28} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('History')}
          >
            <MaterialIcons
              name="history"
              size={24}
              color="#16a34a"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Harvest History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('Notifications')}
          >
            <MaterialIcons
              name="notifications"
              size={24}
              color="#16a34a"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('ReportIssue')}
          >
            <MaterialIcons
              name="bug-report"
              size={24}
              color="#16a34a"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Report Issue</Text>
          </TouchableOpacity>

          <View style={styles.emptySpace} />

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <MaterialIcons
              name="logout"
              size={24}
              color="#dc2626"
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptySpace} />
      </View>
    </Modal>
  );
}
