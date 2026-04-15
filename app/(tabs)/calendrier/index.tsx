import { API } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { Calendar as MiniCalendar } from "react-native-calendars";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

type TravailEvent = {
  title: string;
  summary: string;
  start: Date;
  end: Date;
  id: number;
  entrepreneur: string | null;
  description: string | null;
  batiment_id: number;
  date_fin: string | null;
};

export default function Calendrier() {
  const {user} = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const estProprietaire = user?.role === 'proprietaire';
  const [mode, setMode] = useState<'week' | '3days'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [hourHeight, setHourHeight] = useState(60);
  const startHeight = useRef(60);
  
  const [travailChoisi, setTravailChoisi] = useState<TravailEvent | null>(null);
  const [showDetail, setShowDetail] = useState(false);

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

  useFocusEffect(
    useCallback(()=>{
      fetch(`${API}/api/travaux?proprietaire_id=${user?.id}`)
        .then(res=>res.json())
        .then(data=>{
          const formatted=data.map((t:any)=> ({
            title: t.adresse,
            summary: t.titre,
            start: new Date(t.date_debut),
            end: t.date_fin ? new Date(t.date_fin): new Date(new Date(t.date_debut).getTime()+60*60*1000),
            id: t.id,
            entrepreneur: t.entrepreneur,
            description: t.description,
            date_fin: t.date_fin,
            batiment_id: t.batiment_id,
          }));
          setEvents(formatted);
        })
        .catch(err=> console.error(err));
    }, [])
  );


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
              color='#ffffff'
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
            <MaterialCommunityIcons name="calendar-month" size={20} color={"#ffffff"}/>
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
          onPressEvent={(event) => {setTravailChoisi(event as TravailEvent); setShowDetail(true);}}
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

      <Modal
        visible={showDetail}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetail(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDetail(false)}
        >
          <View style={styles.detailModal}>
            <Text style={styles.detailTitre}>{travailChoisi?.summary}</Text>
            <Text style={styles.detailAdresse}>{travailChoisi?.title}</Text>

            {travailChoisi?.entrepreneur &&(
              <Text style={styles.detailInfo}>
                {travailChoisi.entrepreneur}
              </Text>
            )}

            {travailChoisi?.description &&(
              <Text style={styles.detailInfo}>
                {travailChoisi.description}
              </Text>
            )}

            
            <Text style={styles.detailInfo}>
              Début:{travailChoisi?.start.toLocaleDateString('fr-CA')} à {travailChoisi?.start.toLocaleDateString('fr-CA', {hour:'2-digit', minute:'2-digit'})}
            </Text>

            {travailChoisi?.date_fin &&(
              <Text style={styles.detailInfo}>
                Fin: {new Date(travailChoisi.date_fin).toLocaleDateString('fr-CA')} à {new Date(travailChoisi.date_fin).toLocaleDateString('fr-CA', {hour: '2-digit', minute: '2-digit'})}
              </Text>
            )}

            <View style={styles.detailBtns}>
              <TouchableOpacity
                style={styles.modifierBtn}
                onPress={()=>{
                  setShowDetail(false);
                  router.push({
                    pathname: '/(tabs)/calendrier/nouveau_travail' as any,
                    params: {
                      id: travailChoisi?.id,
                      titre: travailChoisi?.summary,
                      entrepreneur: travailChoisi?.entrepreneur,
                      description: travailChoisi?.description,
                      batiment_id: travailChoisi?.batiment_id,
                      adresse: travailChoisi?.title,
                      date_debut: travailChoisi?.start.toISOString(),
                      date_fin: travailChoisi?.date_fin,
                    }
                  });
                }}
              >
                <Text style={styles.modifierBtnText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>

        </TouchableOpacity>
      </Modal>
      
      {estProprietaire &&(
      <TouchableOpacity style={styles.fab} onPress={()=>router.push('/(tabs)/calendrier/nouveau_travail' as any)}>
        <MaterialCommunityIcons name='plus' size={30} color={'#fff'}/>
      </TouchableOpacity>
      )}
    </GestureHandlerRootView>
    </>
  );
};


const styles = StyleSheet.create({
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerBtnText: {
    color: '#ffffff',
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

  detailModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e1e2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 4,
  },
  detailTitre: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailAdresse: {
    color: '#7C83F5',
    fontSize:15,
    marginBottom:16,
  },
  detailInfo: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 8,
  },
  detailBtns: {
    marginTop: 20,
    gap: 10,
  },
  supprimerBtn: {
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center'
  },
  supprimerBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modifierBtn:{
    backgroundColor: '#F5C542',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  modifierBtnText:{
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
