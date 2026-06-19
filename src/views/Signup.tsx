import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 16,
    flex: 1,
  },
  fullWidthInputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  picker: {
    color: '#111827',
  },
  signupButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 16,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  linkText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

// Municipalities in Negros Occidental with their barangays
const municipalities: { [key: string]: string[] } = {
  'Bacolod City': [
    'Abutin',
    'Aguinaldo',
    'Alangilan',
    'Banago',
    'Bantayan',
    'Barangay 1',
    'Barangay 10',
    'Barangay 11',
    'Barangay 12',
    'Barangay 13',
    'Barangay 14',
    'Barangay 15',
    'Barangay 16',
    'Barangay 17',
    'Barangay 18',
    'Barangay 19',
    'Barangay 2',
    'Barangay 20',
    'Barangay 21',
    'Barangay 22',
    'Barangay 23',
    'Barangay 24',
    'Barangay 25',
    'Barangay 26',
    'Barangay 27',
    'Barangay 28',
    'Barangay 29',
    'Barangay 3',
    'Barangay 30',
    'Barangay 4',
    'Barangay 5',
    'Barangay 6',
    'Barangay 7',
    'Barangay 8',
    'Barangay 9',
    'Basak',
    'Bella Vista',
    'Bengancia',
    'Buan',
    'Bumguay',
    'Cabug',
    'Cacutayan',
    'Calinog',
    'Calubian',
    'Camingawan',
    'Canlanipa',
    'Cantabaco',
    'Canturan',
    'Carnation',
    'Castilla',
    'Caypagan',
    'Cegilo',
    'Celuran',
    'Chaves',
    'Cingcong',
    'Cogon',
    'Compostela',
    'Concepcion',
    'Corazon de Jesus',
    'Cubay',
    'Culasi',
    'Cumintala',
    'Cupang',
    'Cutcutan',
  ],
  'Cadiz City': [
    'Angar',
    'Bani',
    'Benguet',
    'Boliod',
    'Bulacao',
    'Calangcang',
    'Calinog',
    'Camalandaan',
    'Camandag',
    'Camantiles',
    'Camingawan',
    'Campuesayan',
    'Cancarero',
    'Candelaria',
    'Cansuran',
    'Cantabaco',
    'Cantica',
    'Capanduhan',
    'Capisnon',
    'Capo',
    'Caridad',
    'Casidlan',
    'Casigungan',
    'Castillo',
  ],
  'Himamaylan City': [
    'Bagacay',
    'Baisac',
    'Balintawak',
    'Bandala',
    'Banlagay',
    'Banuyao',
    'Basilisa',
    'Baspisang',
    'Binalbagan',
  ],
  'La Carlota City': [
    'Bagtic',
    'Balisong',
    'Balintawak',
    'Balubad',
    'Balucason',
    'Banago',
    'Banocboc',
    'Banquerohan',
    'Basac',
  ],
  'Sagay City': [
    'Agustin',
    'Aliwisan',
    'Argao',
    'Atimonan',
    'Balabago',
    'Balaybay',
    'Balete',
    'Balibago',
    'Balindong',
    'Balisong',
  ],
  'San Carlos City': [
    'Abutin',
    'Alegria',
    'Ankilogon',
    'Apatac',
    'Apuao',
    'Arellano',
    'Aringin',
    'Arlegui',
  ],
  'Sipalay City': [
    'Aguilar',
    'Alegre',
    'Alisad',
    'Alitaptap',
    'Almar',
    'Alubijid',
    'Amontay',
    'Anilao',
  ],
};

const municipalityList = Object.keys(municipalities).sort();

interface SignupProps {
  onSignupSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function Signup({ onSignupSuccess, onNavigateToLogin }: SignupProps) {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [municipality, setMunicipality] = useState(municipalityList[0]);
  const [barangay, setBarangay] = useState(municipalities[municipality][0]);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !middleInitial || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (middleInitial.length > 1) {
      Alert.alert('Error', 'Middle Initial should be a single character');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual registration with backend
      // For now, simulate successful signup
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Account created successfully! Please log in.');
      onSignupSuccess();
    } catch (error) {
      Alert.alert('Signup Failed', 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up for Maptanim</Text>

        <View style={styles.rowContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
            />
          </View>
          <View style={[styles.inputContainer, { flex: 0.4 }]}>
            <Text style={styles.label}>M.I.</Text>
            <TextInput
              style={styles.input}
              placeholder="M.I."
              value={middleInitial}
              onChangeText={setMiddleInitial}
              maxLength={1}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.fullWidthInputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.fullWidthInputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <View style={styles.fullWidthInputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <View style={styles.fullWidthInputContainer}>
          <Text style={styles.label}>Municipality</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={municipality}
              onValueChange={(itemValue) => {
                setMunicipality(itemValue);
                setBarangay(municipalities[itemValue][0]);
              }}
              enabled={!loading}
            >
              {municipalityList.map((mun) => (
                <Picker.Item key={mun} label={mun} value={mun} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.fullWidthInputContainer}>
          <Text style={styles.label}>Barangay</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={barangay}
              onValueChange={setBarangay}
              enabled={!loading}
            >
              {municipalities[municipality].map((bar) => (
                <Picker.Item key={bar} label={bar} value={bar} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.signupButtonText}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={onNavigateToLogin} disabled={loading}>
            <Text style={styles.linkText}>Log in here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
