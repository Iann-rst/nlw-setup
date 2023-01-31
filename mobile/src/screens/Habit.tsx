import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";

import { api } from "../lib/axios";
import { gerenateProgressPercentage } from '../utils/generate-progress-percentage';
import { HabitsEmpty } from "../components/HabitsEmpty";

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
    created_at: Date;
  }[]
}


export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const habitsProgress = dayInfo?.possibleHabits.length
    ?
    gerenateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
    : 0;


  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get("/day", { params: { date } });

      setDayInfo(response.data);

      setCompletedHabits(response.data.completedHabits)

    } catch (error) {
      console.log(error);
      Alert.alert("Erro!", "Não foi carregar as informações dos hábitos!")

    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabits(habitId: string) {
    if (completedHabits.includes(habitId)) {
      setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
    } else {
      setCompletedHabits(prevState => [...prevState, habitId]);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, [])


  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base capitalize">
          {dayOfWeek}
        </Text>

        <Text className="mt-6 text-white font-extrabold text-3xl capitalize">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className="mt-6">
          {
            dayInfo!.possibleHabits.length > 0 ?
              dayInfo?.possibleHabits.map(habit => (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  onPress={() => handleToggleHabits(habit.id)}
                />
              ))
              : <HabitsEmpty />
          }
        </View>
      </ScrollView>
    </View>
  )
}