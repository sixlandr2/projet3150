import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { Calendar as MiniCalendar } from "react-native-calendars";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
const events = [
  {
    title: '1234 rue Doe',
    summary: 'Réparation mur',
    start: new Date(2026, 1, 9, 15, 0),
    end: new Date(2026, 1, 9, 16, 0),
  },
];

export default function Calendrier() {
  const [mode, setMode] = useState<'week' | '3days'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [hourHeight, setHourHeight] = useState(60);
  const startHeight = useRef(60);

  const pinchGesture = Gesture.Pinch()
    .runOnJS(true)
    .onBegin(() => {
      startHeight.current = hourHeight;
    })
    .onUpdate((e) => {
      const newHeight = Math.min(Math.max(startHeight.current * e.scale, 40), 150);
      setHourHeight(newHeight);
    })

  const toggleMode = () => {
    setMode(mode === 'week' ? '3days' : 'week');
  };

  const goToPreviously = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - (mode === 'week' ? 7 : 3));
    setCurrentDate(prev);
  };

  const goToNext = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + (mode === 'week' ? 7 : 3));
    setCurrentDate(next);
  };

  const getWeekLabel = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    const days = mode === 'week' ? 6 : 2;
    end.setDate(end.getDate() + days);
    const fmt = (d:Date) => d.toLocaleDateString('fr-CA', { month: 'short', day: '2-digit'});
    return `${fmt(start)} - ${fmt(end)}`;
  };

  const onDayPress = (day: { dateString: string }) => {
    setCurrentDate(new Date(day.dateString));
    setShowPicker(false);
  };
  const markedToday = {
    [currentDate.toISOString().split('T')[0]]: {
      selected: true,
      selectedColor: '#7C83F5',
    }
  };


  return (
    <>
    <GestureHandlerRootView style = {{ flex: 1 }}>
      <Stack.Screen options={{
        headerShown: true,
        title: "Calendrier",
        headerLeft: () => (
          <TouchableOpacity onPress={toggleMode} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>
              {mode === 'week' ? '7j' : '3j'}
            </Text>
            <MaterialCommunityIcons
              name="calendar-sync"
              size={16}
              color='#6366f1'
            />
          </TouchableOpacity>
        ),

        headerTitle: () => (
          <View style={styles.headerNav}>
            <TouchableOpacity onPress={goToPreviously}>
              <MaterialCommunityIcons name='chevron-left' size={24} color='#1e1e2e'/>
            </TouchableOpacity>
            <Text style={styles.headerNavText}>{getWeekLabel()}</Text>
            <TouchableOpacity onPress={goToNext}>
              <MaterialCommunityIcons name="chevron-right" size={24} color={'#1e1e2e'}/>
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.headerBtn}>
            <MaterialCommunityIcons name="calendar-month" size={20} color={"#6366f1"}/>
          </TouchableOpacity>
        ),
        headerBackVisible:false,
        headerStyle: { backgroundColor: '#7C83F5'},
        headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
        headerShadowVisible: false,
      }} />
      <GestureDetector gesture={pinchGesture}>
        <View style={{ flex: 1}}>
        <Calendar
          events={events}
          height={600}
          mode={mode}
          date={currentDate}
          locale='fr'
          swipeEnabled={true}
          showTime={true}
          scrollOffsetMinutes={480}
          hourRowHeight={hourHeight}
          eventCellStyle={{ backgroundColor: '#7C83F5', borderRadius: 8 }}
          onPressEvent={(event) => console.log(event)}
          onSwipeEnd={(date) => setCurrentDate(date)}
        />
        </View>
      </GestureDetector>  
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <MiniCalendar
              onDayPress={onDayPress}
              markedDates={markedToday}
              theme={{
                selectedDayBackgroundColor: '#7C83F5',
                todayTextColor: '#7C83F5',
                dotColor: '#7C83F5',
                arrowColor: '#7C83F5',
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
              }}
            />
          </View>

        </TouchableOpacity>
      </Modal>

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name='plus' size={30} color={'#fff'}/>
      </TouchableOpacity>
    </GestureHandlerRootView>
    </>
  );
};


const styles = StyleSheet.create({
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ede9fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  headerBtnText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 13,
  },

  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerNavText: {
    color: '#1e1e2e',
    fontWeight: '600',
    fontSize: 13,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 12,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },

  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e1e2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
