import React, {useEffect, useState} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {
  findCollegeByDepartment,
  INHA_COLLEGE_DEPARTMENTS,
} from '../constants/inhaDepartments';
import {colors} from '../styles/colors';

type DepartmentSelectModalProps = {
  visible: boolean;
  selectedDepartment: string;
  onSelect: (department: string) => void;
  onClose: () => void;
};

type SelectionStep = 'college' | 'department';

export function DepartmentSelectModal({
  visible,
  selectedDepartment,
  onSelect,
  onClose,
}: DepartmentSelectModalProps) {
  const initialCollege = findCollegeByDepartment(selectedDepartment).college;
  const [selectedCollege, setSelectedCollege] = useState(initialCollege);
  const [selectionStep, setSelectionStep] = useState<SelectionStep>('college');

  useEffect(() => {
    if (visible) {
      setSelectedCollege(findCollegeByDepartment(selectedDepartment).college);
      setSelectionStep('college');
    }
  }, [selectedDepartment, visible]);

  const selectedCollegeGroup =
    INHA_COLLEGE_DEPARTMENTS.find(group => group.college === selectedCollege) ||
    INHA_COLLEGE_DEPARTMENTS[0];

  const handleSelectCollege = (college: string) => {
    setSelectedCollege(college);
    setSelectionStep('department');
  };

  const handleClose = () => {
    setSelectionStep('college');
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible && selectionStep === 'college'}
        transparent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.departmentSheet}>
            <Text style={[styles.titleText, styles.standaloneTitle]}>
              단과대 선택
            </Text>

            <ScrollView style={styles.optionList}>
              {INHA_COLLEGE_DEPARTMENTS.map(group => {
                const isSelected = selectedCollege === group.college;

                return (
                  <Pressable
                    key={group.college}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => handleSelectCollege(group.college)}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}>
                      {group.college}
                    </Text>

                    <Ionicons name="chevron-forward" size={18} color="#777777" />
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={visible && selectionStep === 'department'}
        transparent
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.departmentSheet}>
            <View style={styles.titleRow}>
              <Pressable
                style={styles.titleSideButton}
                onPress={() => setSelectionStep('college')}>
                <Ionicons name="chevron-back" size={22} color="#555555" />
              </Pressable>

              <Text style={styles.titleText}>학과 선택</Text>

              <View style={styles.titleSideButton} />
            </View>

            <Text style={styles.selectedCollegeText}>
              {selectedCollegeGroup.college}
            </Text>

            <ScrollView style={styles.optionList}>
              {selectedCollegeGroup.departments.map(department => {
                const isSelected = selectedDepartment === department;

                return (
                  <Pressable
                    key={department}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => onSelect(department)}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}>
                      {department}
                    </Text>

                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color="#79AD6F" />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  departmentSheet: {
    width: '100%',
    maxHeight: '78%',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
  },

  titleText: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textDark,
    textAlign: 'center',
  },

  standaloneTitle: {
    marginBottom: 14,
  },

  titleRow: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  titleSideButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedCollegeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 10,
  },

  optionList: {
    maxHeight: 336,
  },

  option: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  optionSelected: {
    backgroundColor: '#F0F6EE',
  },

  optionText: {
    flex: 1,
    paddingRight: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },

  optionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '900',
  },

  cancelButton: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  cancelText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textSecondary,
  },
});
