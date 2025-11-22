"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Trophy, 
  Calendar,
  CheckCircle2,
  Flame,
  Target,
  Zap,
  Award,
  ChevronRight,
  User,
  Activity,
  Home,
  Info,
  Play
} from "lucide-react"

type UserData = {
  name: string
  age: number
  weight: number
  height: number
  goal: "perder" | "ganhar" | "manter"
  level: "iniciante" | "intermediario" | "avancado"
}

type DailyProgress = {
  date: string
  workoutDone: boolean
  mealsCompleted: number
  waterIntake: number
}

type Exercise = {
  name: string
  video: string
  homeAlternative?: string
  homeAlternativeVideo?: string
  sets?: string
  reps?: string
}

export default function FitnessApp() {
  const router = useRouter()
  const [step, setStep] = useState<"onboarding" | "dashboard">("onboarding")
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: 0,
    weight: 0,
    height: 0,
    goal: "perder",
    level: "iniciante"
  })
  const [currentDay, setCurrentDay] = useState(1)
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    date: new Date().toISOString().split('T')[0],
    workoutDone: false,
    mealsCompleted: 0,
    waterIntake: 0
  })
  const [workoutChecklist, setWorkoutChecklist] = useState<boolean[]>([])
  const [streak, setStreak] = useState(0)

  // Calcular TMB e calorias
  const calculateCalories = () => {
    if (!userData.weight || !userData.height || !userData.age) return 0
    
    // Fórmula de Harris-Benedict (simplificada)
    const tmb = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5
    
    if (userData.goal === "perder") return Math.round(tmb * 1.2 - 500)
    if (userData.goal === "ganhar") return Math.round(tmb * 1.5 + 300)
    return Math.round(tmb * 1.3)
  }

  const calculateMacros = () => {
    const calories = calculateCalories()
    if (userData.goal === "ganhar") {
      return {
        protein: Math.round(userData.weight * 2),
        carbs: Math.round(calories * 0.45 / 4),
        fats: Math.round(calories * 0.25 / 9)
      }
    } else if (userData.goal === "perder") {
      return {
        protein: Math.round(userData.weight * 2.2),
        carbs: Math.round(calories * 0.35 / 4),
        fats: Math.round(calories * 0.30 / 9)
      }
    }
    return {
      protein: Math.round(userData.weight * 1.8),
      carbs: Math.round(calories * 0.40 / 4),
      fats: Math.round(calories * 0.30 / 9)
    }
  }

  // Plano de treino baseado no nível e dia
  const getWorkoutPlan = (day: number) => {
    const week = Math.ceil(day / 7)
    const dayOfWeek = ((day - 1) % 7) + 1

    const workouts = {
      iniciante: {
        1: { 
          name: "Treino A - Corpo Todo", 
          exercises: [
            { 
              name: "Agachamento livre", 
              video: "https://www.youtube.com/embed/nvVa-WFGwmM",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Agachamento sem peso",
              homeAlternativeVideo: "https://www.youtube.com/embed/3uZE_E11eg4"
            },
            { 
              name: "Flexão de braço", 
              video: "https://www.youtube.com/embed/IODxDxX7oi4",
              sets: "3 séries",
              reps: "8-12 reps",
              homeAlternative: "Flexão de joelhos (mais fácil)",
              homeAlternativeVideo: "https://www.youtube.com/embed/QJ7cqXaAp8w"
            },
            { 
              name: "Remada curvada", 
              video: "https://www.youtube.com/embed/e53vSzibkO0",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Remada com mochila cheia",
              homeAlternativeVideo: "https://www.youtube.com/embed/e53vSzibkO0"
            },
            { 
              name: "Prancha", 
              video: "https://www.youtube.com/embed/uxPlAbWFUDs",
              sets: "3 séries",
              reps: "30-45 seg",
              homeAlternative: "Prancha em qualquer lugar",
              homeAlternativeVideo: "https://www.youtube.com/embed/uxPlAbWFUDs"
            },
            { 
              name: "Polichinelo", 
              video: "https://www.youtube.com/embed/guvPySViG7o",
              sets: "3 séries",
              reps: "20-30 reps",
              homeAlternative: "Polichinelo (perfeito para casa)",
              homeAlternativeVideo: "https://www.youtube.com/embed/guvPySViG7o"
            }
          ] 
        },
        2: { 
          name: "Cardio Leve", 
          exercises: [
            { 
              name: "Caminhada 20min", 
              video: "https://www.youtube.com/embed/kJq2l6uS_1U",
              homeAlternative: "Caminhada no lugar",
              homeAlternativeVideo: "https://www.youtube.com/embed/kJq2l6uS_1U"
            },
            { 
              name: "Alongamento 10min", 
              video: "https://www.youtube.com/embed/g_tea8ZNk5A",
              homeAlternative: "Alongamento em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/g_tea8ZNk5A"
            }
          ] 
        },
        3: { 
          name: "Treino B - Corpo Todo", 
          exercises: [
            { 
              name: "Afundo", 
              video: "https://www.youtube.com/embed/rltJymhFtHg",
              sets: "3 séries",
              reps: "10-12 cada perna",
              homeAlternative: "Afundo sem peso",
              homeAlternativeVideo: "https://www.youtube.com/embed/rltJymhFtHg"
            },
            { 
              name: "Flexão inclinada", 
              video: "https://www.youtube.com/embed/IODxDxX7oi4",
              sets: "3 séries",
              reps: "10-15 reps",
              homeAlternative: "Flexão na parede ou sofá",
              homeAlternativeVideo: "https://www.youtube.com/embed/QJ7cqXaAp8w"
            },
            { 
              name: "Elevação lateral", 
              video: "https://www.youtube.com/embed/3VcKaXpzqRo",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Elevação com garrafas de água",
              homeAlternativeVideo: "https://www.youtube.com/embed/3VcKaXpzqRo"
            },
            { 
              name: "Abdominal", 
              video: "https://www.youtube.com/embed/1fbU_MkV7NE",
              sets: "3 séries",
              reps: "15-20 reps",
              homeAlternative: "Abdominal no chão",
              homeAlternativeVideo: "https://www.youtube.com/embed/1fbU_MkV7NE"
            },
            { 
              name: "Burpee", 
              video: "https://www.youtube.com/embed/TU8QYVW0gDU",
              sets: "3 séries",
              reps: "8-10 reps",
              homeAlternative: "Burpee (perfeito para casa)",
              homeAlternativeVideo: "https://www.youtube.com/embed/TU8QYVW0gDU"
            }
          ] 
        },
        4: { 
          name: "Descanso Ativo", 
          exercises: [
            { 
              name: "Yoga 15min", 
              video: "https://www.youtube.com/embed/v7AYKMP6rOE",
              homeAlternative: "Yoga em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/v7AYKMP6rOE"
            },
            { 
              name: "Alongamento", 
              video: "https://www.youtube.com/embed/g_tea8ZNk5A",
              homeAlternative: "Alongamento em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/g_tea8ZNk5A"
            }
          ] 
        },
        5: { 
          name: "Treino C - Corpo Todo", 
          exercises: [
            { 
              name: "Agachamento sumô", 
              video: "https://www.youtube.com/embed/3uZE_E11eg4",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Agachamento sumô sem peso",
              homeAlternativeVideo: "https://www.youtube.com/embed/3uZE_E11eg4"
            },
            { 
              name: "Flexão diamante", 
              video: "https://www.youtube.com/embed/IODxDxX7oi4",
              sets: "3 séries",
              reps: "8-12 reps",
              homeAlternative: "Flexão normal (mais fácil)",
              homeAlternativeVideo: "https://www.youtube.com/embed/QJ7cqXaAp8w"
            },
            { 
              name: "Desenvolvimento", 
              video: "https://www.youtube.com/embed/qEwKCR5JCog",
              sets: "3 séries",
              reps: "10-12 reps",
              homeAlternative: "Desenvolvimento com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/qEwKCR5JCog"
            },
            { 
              name: "Prancha lateral", 
              video: "https://www.youtube.com/embed/uxPlAbWFUDs",
              sets: "3 séries",
              reps: "20-30 seg cada lado",
              homeAlternative: "Prancha lateral em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/uxPlAbWFUDs"
            },
            { 
              name: "Mountain climber", 
              video: "https://www.youtube.com/embed/nmwgirgXLYM",
              sets: "3 séries",
              reps: "20-30 reps",
              homeAlternative: "Mountain climber (perfeito para casa)",
              homeAlternativeVideo: "https://www.youtube.com/embed/nmwgirgXLYM"
            }
          ] 
        },
        6: { 
          name: "Cardio Moderado", 
          exercises: [
            { 
              name: "Corrida leve 25min", 
              video: "https://www.youtube.com/embed/kJq2l6uS_1U",
              homeAlternative: "Corrida no lugar ou pular corda",
              homeAlternativeVideo: "https://www.youtube.com/embed/kJq2l6uS_1U"
            },
            { 
              name: "Alongamento", 
              video: "https://www.youtube.com/embed/g_tea8ZNk5A",
              homeAlternative: "Alongamento em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/g_tea8ZNk5A"
            }
          ] 
        },
        7: { 
          name: "Descanso Total", 
          exercises: [
            { 
              name: "Recuperação", 
              video: "https://www.youtube.com/embed/v7AYKMP6rOE",
              homeAlternative: "Descanso em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/v7AYKMP6rOE"
            }
          ] 
        }
      },
      intermediario: {
        1: { 
          name: "Peito e Tríceps", 
          exercises: [
            { 
              name: "Supino", 
              video: "https://www.youtube.com/embed/rT7DgCr-3pg",
              sets: "4 séries",
              reps: "8-12 reps",
              homeAlternative: "Flexão com elevação dos pés",
              homeAlternativeVideo: "https://www.youtube.com/embed/3_lAKU8X1c0"
            },
            { 
              name: "Crucifixo", 
              video: "https://www.youtube.com/embed/eozdVDA78K0",
              sets: "3 séries",
              reps: "10-12 reps",
              homeAlternative: "Crucifixo com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/eozdVDA78K0"
            },
            { 
              name: "Flexão", 
              video: "https://www.youtube.com/embed/IODxDxX7oi4",
              sets: "3 séries",
              reps: "15-20 reps",
              homeAlternative: "Flexão tradicional",
              homeAlternativeVideo: "https://www.youtube.com/embed/IODxDxX7oi4"
            },
            { 
              name: "Tríceps testa", 
              video: "https://www.youtube.com/embed/d_KZxkY_0cM",
              sets: "3 séries",
              reps: "10-12 reps",
              homeAlternative: "Tríceps banco (cadeira)",
              homeAlternativeVideo: "https://www.youtube.com/embed/0326dy_-CzM"
            },
            { 
              name: "Mergulho", 
              video: "https://www.youtube.com/embed/0326dy_-CzM",
              sets: "3 séries",
              reps: "10-15 reps",
              homeAlternative: "Mergulho em cadeira",
              homeAlternativeVideo: "https://www.youtube.com/embed/0326dy_-CzM"
            }
          ] 
        },
        2: { 
          name: "Costas e Bíceps", 
          exercises: [
            { 
              name: "Barra fixa", 
              video: "https://www.youtube.com/embed/eGo4IYlbE5g",
              sets: "4 séries",
              reps: "6-10 reps",
              homeAlternative: "Remada invertida em mesa",
              homeAlternativeVideo: "https://www.youtube.com/embed/e53vSzibkO0"
            },
            { 
              name: "Remada", 
              video: "https://www.youtube.com/embed/e53vSzibkO0",
              sets: "4 séries",
              reps: "8-12 reps",
              homeAlternative: "Remada com mochila pesada",
              homeAlternativeVideo: "https://www.youtube.com/embed/e53vSzibkO0"
            },
            { 
              name: "Pulldown", 
              video: "https://www.youtube.com/embed/CAwf7n6Luuc",
              sets: "3 séries",
              reps: "10-12 reps",
              homeAlternative: "Puxada com elástico",
              homeAlternativeVideo: "https://www.youtube.com/embed/CAwf7n6Luuc"
            },
            { 
              name: "Rosca direta", 
              video: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
              sets: "3 séries",
              reps: "10-12 reps",
              homeAlternative: "Rosca com garrafas/mochila",
              homeAlternativeVideo: "https://www.youtube.com/embed/ykJmrZ5v0Oo"
            },
            { 
              name: "Rosca martelo", 
              video: "https://www.youtube.com/embed/zC3nLlEvin4",
              sets: "3 séries",
              reps: "10-12 reps",
              homeAlternative: "Rosca martelo com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/zC3nLlEvin4"
            }
          ] 
        },
        3: { 
          name: "Pernas", 
          exercises: [
            { 
              name: "Agachamento", 
              video: "https://www.youtube.com/embed/nvVa-WFGwmM",
              sets: "4 séries",
              reps: "10-15 reps",
              homeAlternative: "Agachamento búlgaro (uma perna)",
              homeAlternativeVideo: "https://www.youtube.com/embed/3uZE_E11eg4"
            },
            { 
              name: "Leg press", 
              video: "https://www.youtube.com/embed/IZxyjW7MPJQ",
              sets: "4 séries",
              reps: "12-15 reps",
              homeAlternative: "Agachamento com salto",
              homeAlternativeVideo: "https://www.youtube.com/embed/3uZE_E11eg4"
            },
            { 
              name: "Cadeira extensora", 
              video: "https://www.youtube.com/embed/YyvSfVjQeL0",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Agachamento isométrico (parede)",
              homeAlternativeVideo: "https://www.youtube.com/embed/3uZE_E11eg4"
            },
            { 
              name: "Cadeira flexora", 
              video: "https://www.youtube.com/embed/1Tq3QdYUuHs",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Ponte glúteo (uma perna)",
              homeAlternativeVideo: "https://www.youtube.com/embed/wPM8icPu6H8"
            },
            { 
              name: "Panturrilha", 
              video: "https://www.youtube.com/embed/gwLzBJYoWlI",
              sets: "4 séries",
              reps: "15-20 reps",
              homeAlternative: "Elevação de panturrilha (escada)",
              homeAlternativeVideo: "https://www.youtube.com/embed/gwLzBJYoWlI"
            }
          ] 
        },
        4: { 
          name: "Ombros e Abs", 
          exercises: [
            { 
              name: "Desenvolvimento", 
              video: "https://www.youtube.com/embed/qEwKCR5JCog",
              sets: "4 séries",
              reps: "8-12 reps",
              homeAlternative: "Desenvolvimento com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/qEwKCR5JCog"
            },
            { 
              name: "Elevação lateral", 
              video: "https://www.youtube.com/embed/3VcKaXpzqRo",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Elevação lateral com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/3VcKaXpzqRo"
            },
            { 
              name: "Elevação frontal", 
              video: "https://www.youtube.com/embed/qzSDdkTHXLI",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Elevação frontal com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/qzSDdkTHXLI"
            },
            { 
              name: "Abdominal", 
              video: "https://www.youtube.com/embed/1fbU_MkV7NE",
              sets: "4 séries",
              reps: "15-20 reps",
              homeAlternative: "Abdominal em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/1fbU_MkV7NE"
            },
            { 
              name: "Prancha", 
              video: "https://www.youtube.com/embed/uxPlAbWFUDs",
              sets: "3 séries",
              reps: "45-60 seg",
              homeAlternative: "Prancha em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/uxPlAbWFUDs"
            }
          ] 
        },
        5: { 
          name: "Treino Full Body", 
          exercises: [
            { 
              name: "Agachamento", 
              video: "https://www.youtube.com/embed/nvVa-WFGwmM",
              sets: "4 séries",
              reps: "10-12 reps",
              homeAlternative: "Agachamento pistol (avançado)",
              homeAlternativeVideo: "https://www.youtube.com/embed/3uZE_E11eg4"
            },
            { 
              name: "Supino", 
              video: "https://www.youtube.com/embed/rT7DgCr-3pg",
              sets: "4 séries",
              reps: "8-12 reps",
              homeAlternative: "Flexão com peso nas costas",
              homeAlternativeVideo: "https://www.youtube.com/embed/qqECekG4jMo"
            },
            { 
              name: "Remada", 
              video: "https://www.youtube.com/embed/e53vSzibkO0",
              sets: "4 séries",
              reps: "8-12 reps",
              homeAlternative: "Remada com mochila pesada",
              homeAlternativeVideo: "https://www.youtube.com/embed/e53vSzibkO0"
            },
            { 
              name: "Desenvolvimento", 
              video: "https://www.youtube.com/embed/qEwKCR5JCog",
              sets: "3 séries",
              reps: "10-12 reps",
              homeAlternative: "Parada de mão (avançado)",
              homeAlternativeVideo: "https://www.youtube.com/embed/qEwKCR5JCog"
            },
            { 
              name: "Burpee", 
              video: "https://www.youtube.com/embed/TU8QYVW0gDU",
              sets: "3 séries",
              reps: "15-20 reps",
              homeAlternative: "Burpee (perfeito para casa)",
              homeAlternativeVideo: "https://www.youtube.com/embed/TU8QYVW0gDU"
            }
          ] 
        },
        6: { 
          name: "HIIT Cardio", 
          exercises: [
            { 
              name: "30s sprint / 30s descanso x 15 rodadas", 
              video: "https://www.youtube.com/embed/kJq2l6uS_1U",
              homeAlternative: "Sprint no lugar ou escada",
              homeAlternativeVideo: "https://www.youtube.com/embed/kJq2l6uS_1U"
            }
          ] 
        },
        7: { 
          name: "Descanso", 
          exercises: [
            { 
              name: "Recuperação ativa", 
              video: "https://www.youtube.com/embed/v7AYKMP6rOE",
              homeAlternative: "Descanso em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/v7AYKMP6rOE"
            }
          ] 
        }
      },
      avancado: {
        1: { 
          name: "Peito Pesado", 
          exercises: [
            { 
              name: "Supino reto", 
              video: "https://www.youtube.com/embed/rT7DgCr-3pg",
              sets: "5 séries",
              reps: "6-10 reps",
              homeAlternative: "Flexão com peso (mochila)",
              homeAlternativeVideo: "https://www.youtube.com/embed/qqECekG4jMo"
            },
            { 
              name: "Supino inclinado", 
              video: "https://www.youtube.com/embed/SrqOu55lrYU",
              sets: "4 séries",
              reps: "8-12 reps",
              homeAlternative: "Flexão declinada (pés elevados)",
              homeAlternativeVideo: "https://www.youtube.com/embed/3_lAKU8X1c0"
            },
            { 
              name: "Crucifixo", 
              video: "https://www.youtube.com/embed/eozdVDA78K0",
              sets: "4 séries",
              reps: "10-12 reps",
              homeAlternative: "Crucifixo com garrafas pesadas",
              homeAlternativeVideo: "https://www.youtube.com/embed/eozdVDA78K0"
            },
            { 
              name: "Flexão com peso", 
              video: "https://www.youtube.com/embed/IODxDxX7oi4",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Flexão com mochila pesada",
              homeAlternativeVideo: "https://www.youtube.com/embed/IODxDxX7oi4"
            },
            { 
              name: "Pullover", 
              video: "https://www.youtube.com/embed/FK0MlKEKyIo",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Pullover com garrafa grande",
              homeAlternativeVideo: "https://www.youtube.com/embed/FK0MlKEKyIo"
            }
          ] 
        },
        2: { 
          name: "Costas Pesado", 
          exercises: [
            { 
              name: "Barra fixa com peso", 
              video: "https://www.youtube.com/embed/eGo4IYlbE5g",
              sets: "5 séries",
              reps: "6-10 reps",
              homeAlternative: "Barra fixa ou remada invertida",
              homeAlternativeVideo: "https://www.youtube.com/embed/e53vSzibkO0"
            },
            { 
              name: "Remada curvada", 
              video: "https://www.youtube.com/embed/e53vSzibkO0",
              sets: "4 séries",
              reps: "8-12 reps",
              homeAlternative: "Remada com mochila muito pesada",
              homeAlternativeVideo: "https://www.youtube.com/embed/e53vSzibkO0"
            },
            { 
              name: "Pulldown", 
              video: "https://www.youtube.com/embed/CAwf7n6Luuc",
              sets: "4 séries",
              reps: "10-12 reps",
              homeAlternative: "Puxada com elástico forte",
              homeAlternativeVideo: "https://www.youtube.com/embed/CAwf7n6Luuc"
            },
            { 
              name: "Remada unilateral", 
              video: "https://www.youtube.com/embed/e53vSzibkO0",
              sets: "3 séries",
              reps: "10-12 cada lado",
              homeAlternative: "Remada unilateral com mochila",
              homeAlternativeVideo: "https://www.youtube.com/embed/e53vSzibkO0"
            },
            { 
              name: "Encolhimento", 
              video: "https://www.youtube.com/embed/cJRVVxmytaM",
              sets: "4 séries",
              reps: "12-15 reps",
              homeAlternative: "Encolhimento com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/cJRVVxmytaM"
            }
          ] 
        },
        3: { 
          name: "Pernas Pesado", 
          exercises: [
            { 
              name: "Agachamento livre", 
              video: "https://www.youtube.com/embed/nvVa-WFGwmM",
              sets: "5 séries",
              reps: "6-10 reps",
              homeAlternative: "Agachamento pistol (uma perna)",
              homeAlternativeVideo: "https://www.youtube.com/embed/3uZE_E11eg4"
            },
            { 
              name: "Agachamento frontal", 
              video: "https://www.youtube.com/embed/3uZE_E11eg4",
              sets: "4 séries",
              reps: "8-12 reps",
              homeAlternative: "Agachamento com mochila na frente",
              homeAlternativeVideo: "https://www.youtube.com/embed/3uZE_E11eg4"
            },
            { 
              name: "Leg press", 
              video: "https://www.youtube.com/embed/IZxyjW7MPJQ",
              sets: "4 séries",
              reps: "12-15 reps",
              homeAlternative: "Agachamento explosivo com salto",
              homeAlternativeVideo: "https://www.youtube.com/embed/3uZE_E11eg4"
            },
            { 
              name: "Stiff", 
              video: "https://www.youtube.com/embed/1uDiW5--rAE",
              sets: "4 séries",
              reps: "10-12 reps",
              homeAlternative: "Stiff com mochila pesada",
              homeAlternativeVideo: "https://www.youtube.com/embed/1uDiW5--rAE"
            },
            { 
              name: "Afundo búlgaro", 
              video: "https://www.youtube.com/embed/rltJymhFtHg",
              sets: "3 séries",
              reps: "10-12 cada perna",
              homeAlternative: "Afundo búlgaro em cadeira",
              homeAlternativeVideo: "https://www.youtube.com/embed/rltJymhFtHg"
            }
          ] 
        },
        4: { 
          name: "Ombros e Trapézio", 
          exercises: [
            { 
              name: "Desenvolvimento militar", 
              video: "https://www.youtube.com/embed/qEwKCR5JCog",
              sets: "5 séries",
              reps: "6-10 reps",
              homeAlternative: "Desenvolvimento com garrafas pesadas",
              homeAlternativeVideo: "https://www.youtube.com/embed/qEwKCR5JCog"
            },
            { 
              name: "Elevação lateral", 
              video: "https://www.youtube.com/embed/3VcKaXpzqRo",
              sets: "4 séries",
              reps: "12-15 reps",
              homeAlternative: "Elevação lateral com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/3VcKaXpzqRo"
            },
            { 
              name: "Remada alta", 
              video: "https://www.youtube.com/embed/amCU-ziHITM",
              sets: "4 séries",
              reps: "10-12 reps",
              homeAlternative: "Remada alta com mochila",
              homeAlternativeVideo: "https://www.youtube.com/embed/amCU-ziHITM"
            },
            { 
              name: "Crucifixo inverso", 
              video: "https://www.youtube.com/embed/EA7u4Q_8HQ0",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Crucifixo inverso com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/EA7u4Q_8HQ0"
            },
            { 
              name: "Encolhimento", 
              video: "https://www.youtube.com/embed/cJRVVxmytaM",
              sets: "4 séries",
              reps: "15-20 reps",
              homeAlternative: "Encolhimento com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/cJRVVxmytaM"
            }
          ] 
        },
        5: { 
          name: "Braços Completo", 
          exercises: [
            { 
              name: "Rosca direta", 
              video: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
              sets: "4 séries",
              reps: "8-12 reps",
              homeAlternative: "Rosca com mochila pesada",
              homeAlternativeVideo: "https://www.youtube.com/embed/ykJmrZ5v0Oo"
            },
            { 
              name: "Rosca martelo", 
              video: "https://www.youtube.com/embed/zC3nLlEvin4",
              sets: "4 séries",
              reps: "10-12 reps",
              homeAlternative: "Rosca martelo com garrafas",
              homeAlternativeVideo: "https://www.youtube.com/embed/zC3nLlEvin4"
            },
            { 
              name: "Tríceps testa", 
              video: "https://www.youtube.com/embed/d_KZxkY_0cM",
              sets: "4 séries",
              reps: "10-12 reps",
              homeAlternative: "Tríceps banco (cadeira)",
              homeAlternativeVideo: "https://www.youtube.com/embed/0326dy_-CzM"
            },
            { 
              name: "Tríceps corda", 
              video: "https://www.youtube.com/embed/2-LAMcpzODU",
              sets: "3 séries",
              reps: "12-15 reps",
              homeAlternative: "Tríceps com elástico",
              homeAlternativeVideo: "https://www.youtube.com/embed/2-LAMcpzODU"
            },
            { 
              name: "Rosca concentrada", 
              video: "https://www.youtube.com/embed/Jvj2wV0zXo8",
              sets: "3 séries",
              reps: "10-12 cada braço",
              homeAlternative: "Rosca concentrada com garrafa",
              homeAlternativeVideo: "https://www.youtube.com/embed/Jvj2wV0zXo8"
            }
          ] 
        },
        6: { 
          name: "HIIT Avançado", 
          exercises: [
            { 
              name: "Burpee", 
              video: "https://www.youtube.com/embed/TU8QYVW0gDU",
              sets: "5 séries",
              reps: "20 reps",
              homeAlternative: "Burpee (perfeito para casa)",
              homeAlternativeVideo: "https://www.youtube.com/embed/TU8QYVW0gDU"
            },
            { 
              name: "Box jump", 
              video: "https://www.youtube.com/embed/NBY9-kTuHEk",
              sets: "4 séries",
              reps: "15 reps",
              homeAlternative: "Salto em cadeira/banco",
              homeAlternativeVideo: "https://www.youtube.com/embed/NBY9-kTuHEk"
            },
            { 
              name: "Kettlebell swing", 
              video: "https://www.youtube.com/embed/YSxHifyI6s8",
              sets: "4 séries",
              reps: "20 reps",
              homeAlternative: "Swing com mochila pesada",
              homeAlternativeVideo: "https://www.youtube.com/embed/YSxHifyI6s8"
            },
            { 
              name: "Battle rope", 
              video: "https://www.youtube.com/embed/w8ZfmY6HwPE",
              sets: "4 séries",
              reps: "30 seg",
              homeAlternative: "Mountain climber rápido",
              homeAlternativeVideo: "https://www.youtube.com/embed/nmwgirgXLYM"
            },
            { 
              name: "Sprint", 
              video: "https://www.youtube.com/embed/kJq2l6uS_1U",
              sets: "5 séries",
              reps: "30 seg",
              homeAlternative: "Sprint no lugar",
              homeAlternativeVideo: "https://www.youtube.com/embed/kJq2l6uS_1U"
            }
          ] 
        },
        7: { 
          name: "Descanso", 
          exercises: [
            { 
              name: "Recuperação", 
              video: "https://www.youtube.com/embed/v7AYKMP6rOE",
              homeAlternative: "Descanso em casa",
              homeAlternativeVideo: "https://www.youtube.com/embed/v7AYKMP6rOE"
            }
          ] 
        }
      }
    }

    return workouts[userData.level][dayOfWeek as keyof typeof workouts.iniciante]
  }

  // Plano de dieta
  const getMealPlan = () => {
    const calories = calculateCalories()
    const macros = calculateMacros()

    const meals = {
      perder: [
        { name: "Café da Manhã", foods: "3 ovos mexidos + 1 fatia pão integral + café sem açúcar", cals: Math.round(calories * 0.25) },
        { name: "Lanche da Manhã", foods: "1 fruta + 10 castanhas", cals: Math.round(calories * 0.10) },
        { name: "Almoço", foods: "150g frango grelhado + salada + 3 col arroz integral", cals: Math.round(calories * 0.35) },
        { name: "Lanche da Tarde", foods: "Iogurte grego + whey protein", cals: Math.round(calories * 0.10) },
        { name: "Jantar", foods: "150g peixe + legumes + batata doce", cals: Math.round(calories * 0.20) }
      ],
      ganhar: [
        { name: "Café da Manhã", foods: "4 ovos + 2 fatias pão + pasta amendoim + banana", cals: Math.round(calories * 0.20) },
        { name: "Lanche da Manhã", foods: "Vitamina: whey + aveia + banana + pasta amendoim", cals: Math.round(calories * 0.15) },
        { name: "Almoço", foods: "200g carne vermelha + 5 col arroz + feijão + salada", cals: Math.round(calories * 0.30) },
        { name: "Lanche da Tarde", foods: "Batata doce + frango desfiado + azeite", cals: Math.round(calories * 0.15) },
        { name: "Jantar", foods: "200g frango + macarrão integral + legumes", cals: Math.round(calories * 0.20) }
      ],
      manter: [
        { name: "Café da Manhã", foods: "3 ovos + 2 fatias pão integral + fruta", cals: Math.round(calories * 0.25) },
        { name: "Lanche da Manhã", foods: "Iogurte + granola", cals: Math.round(calories * 0.10) },
        { name: "Almoço", foods: "150g proteína + 4 col arroz + feijão + salada", cals: Math.round(calories * 0.35) },
        { name: "Lanche da Tarde", foods: "Fruta + castanhas", cals: Math.round(calories * 0.10) },
        { name: "Jantar", foods: "150g proteína + legumes + carboidrato", cals: Math.round(calories * 0.20) }
      ]
    }

    return meals[userData.goal]
  }

  const handleStartJourney = () => {
    if (userData.name && userData.age && userData.weight && userData.height) {
      router.push('/checkout')
    }
  }

  const handleWorkoutComplete = () => {
    setDailyProgress({ ...dailyProgress, workoutDone: true })
    setStreak(streak + 1)
  }

  const handleNextDay = () => {
    setCurrentDay(currentDay + 1)
    setDailyProgress({
      date: new Date().toISOString().split('T')[0],
      workoutDone: false,
      mealsCompleted: 0,
      waterIntake: 0
    })
    const workout = getWorkoutPlan(currentDay + 1)
    setWorkoutChecklist(new Array(workout.exercises.length).fill(false))
  }

  const progressPercentage = (currentDay / 30) * 100

  if (step === "onboarding") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-2">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                <Dumbbell className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transformação em 30 Dias
            </CardTitle>
            <CardDescription className="text-lg">
              Seu plano personalizado de treino e dieta para resultados reais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-semibold">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="mt-2 h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age" className="text-base font-semibold">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={userData.age || ""}
                    onChange={(e) => setUserData({ ...userData, age: Number(e.target.value) })}
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-base font-semibold">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={userData.weight || ""}
                    onChange={(e) => setUserData({ ...userData, weight: Number(e.target.value) })}
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-base font-semibold">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={userData.height || ""}
                    onChange={(e) => setUserData({ ...userData, height: Number(e.target.value) })}
                    className="mt-2 h-12"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Objetivo</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "perder", label: "Perder Peso", icon: TrendingUp },
                    { value: "ganhar", label: "Ganhar Massa", icon: Dumbbell },
                    { value: "manter", label: "Manter Forma", icon: Target }
                  ].map((goal) => (
                    <Button
                      key={goal.value}
                      variant={userData.goal === goal.value ? "default" : "outline"}
                      className={`h-20 flex flex-col gap-2 ${userData.goal === goal.value ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}`}
                      onClick={() => setUserData({ ...userData, goal: goal.value as any })}
                    >
                      <goal.icon className="w-6 h-6" />
                      <span className="text-sm">{goal.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Nível de Experiência</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "iniciante", label: "Iniciante" },
                    { value: "intermediario", label: "Intermediário" },
                    { value: "avancado", label: "Avançado" }
                  ].map((level) => (
                    <Button
                      key={level.value}
                      variant={userData.level === level.value ? "default" : "outline"}
                      className={`h-16 ${userData.level === level.value ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}`}
                      onClick={() => setUserData({ ...userData, level: level.value as any })}
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartJourney}
              disabled={!userData.name || !userData.age || !userData.weight || !userData.height}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Começar Minha Jornada
              <ChevronRight className="ml-2 w-6 h-6" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const workout = getWorkoutPlan(currentDay)
  const meals = getMealPlan()
  const calories = calculateCalories()
  const macros = calculateMacros()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <User className="w-8 h-8" />
                Olá, {userData.name}!
              </h1>
              <p className="text-blue-100 mt-1">Dia {currentDay} de 30 - Continue firme! 💪</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <Flame className="w-6 h-6 mx-auto mb-1" />
                <p className="text-2xl font-bold">{streak}</p>
                <p className="text-xs text-blue-100">Sequência</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-1" />
                <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
                <p className="text-xs text-blue-100">Completo</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-3 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <Tabs defaultValue="treino" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14">
            <TabsTrigger value="treino" className="text-base">
              <Dumbbell className="w-5 h-5 mr-2" />
              Treino
            </TabsTrigger>
            <TabsTrigger value="dieta" className="text-base">
              <Apple className="w-5 h-5 mr-2" />
              Dieta
            </TabsTrigger>
            <TabsTrigger value="progresso" className="text-base">
              <Activity className="w-5 h-5 mr-2" />
              Progresso
            </TabsTrigger>
          </TabsList>

          {/* Treino Tab */}
          <TabsContent value="treino" className="space-y-4 mt-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  {workout.name}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Dia {currentDay} - Semana {Math.ceil(currentDay / 7)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="border-2 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 sm:h-64 w-full bg-black">
                        {exercise.video.includes('youtube.com') ? (
                          <iframe
                            src={exercise.video}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video 
                            src={exercise.video} 
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        )}
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full p-2">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2">
                          {exercise.homeAlternative && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
                                >
                                  <Home className="w-4 h-4 mr-1" />
                                  Casa
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Home className="w-5 h-5 text-green-500" />
                                    Alternativa para Casa
                                  </DialogTitle>
                                  <DialogDescription>
                                    Faça este exercício em casa sem equipamento
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="relative h-64 w-full bg-black rounded-lg overflow-hidden">
                                    {exercise.homeAlternativeVideo?.includes('youtube.com') ? (
                                      <iframe
                                        src={exercise.homeAlternativeVideo}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      />
                                    ) : (
                                      <video 
                                        src={exercise.homeAlternativeVideo || exercise.video} 
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                      />
                                    )}
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full p-2">
                                      <Play className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                                    <h4 className="font-bold text-lg mb-2">{exercise.homeAlternative}</h4>
                                    {exercise.sets && exercise.reps && (
                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {exercise.sets} de {exercise.reps}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={workoutChecklist[index]}
                            onCheckedChange={(checked) => {
                              const newChecklist = [...workoutChecklist]
                              newChecklist[index] = checked as boolean
                              setWorkoutChecklist(newChecklist)
                            }}
                            className="w-6 h-6"
                          />
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold ${workoutChecklist[index] ? 'line-through text-gray-500' : ''}`}>
                              {exercise.name}
                            </h3>
                            {exercise.sets && exercise.reps && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {exercise.sets} de {exercise.reps}
                              </p>
                            )}
                          </div>
                          {workoutChecklist[index] && (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleWorkoutComplete}
                    disabled={dailyProgress.workoutDone || !workoutChecklist.every(Boolean)}
                    className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    {dailyProgress.workoutDone ? (
                      <>
                        <CheckCircle2 className="mr-2 w-6 h-6" />
                        Treino Concluído!
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 w-6 h-6" />
                        Marcar como Concluído
                      </>
                    )}
                  </Button>
                  {dailyProgress.workoutDone && currentDay < 30 && (
                    <Button
                      onClick={handleNextDay}
                      className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Próximo Dia
                      <ChevronRight className="ml-2 w-6 h-6" />
                    </Button>
                  )}
                </div>

                {currentDay === 30 && dailyProgress.workoutDone && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg text-center">
                    <Award className="w-16 h-16 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold mb-2">Parabéns! 🎉</h3>
                    <p className="text-lg">Você completou os 30 dias de transformação!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Dicas do Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Assista os vídeos para executar corretamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Descanse 60-90 segundos entre as séries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Beba água durante o treino</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use as alternativas para casa se necessário</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dieta Tab */}
          <TabsContent value="dieta" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardContent className="pt-6 text-center">
                  <Flame className="w-10 h-10 mx-auto mb-2 text-orange-500" />
                  <p className="text-3xl font-bold">{calories}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Calorias/dia</p>
                </CardContent>
              </Card>
              <Card className="border-2 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{macros.protein}g</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Proteína</p>
                </CardContent>
              </Card>
              <Card className="border-2 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{macros.carbs}g</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Carboidratos</p>
                </CardContent>
              </Card>
              <Card className="border-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{macros.fats}g</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Gorduras</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Apple className="w-6 h-6" />
                  Plano Alimentar do Dia
                </CardTitle>
                <CardDescription className="text-green-100">
                  {userData.goal === "perder" ? "Déficit calórico para perda de peso" : 
                   userData.goal === "ganhar" ? "Superávit calórico para ganho de massa" : 
                   "Manutenção do peso atual"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {meals.map((meal, index) => (
                  <div key={index} className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={dailyProgress.mealsCompleted > index}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setDailyProgress({ ...dailyProgress, mealsCompleted: index + 1 })
                            }
                          }}
                          className="w-5 h-5"
                        />
                        <h3 className="font-bold text-lg">{meal.name}</h3>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {meal.cals} kcal
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 ml-8">{meal.foods}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Dicas Nutricionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Beba pelo menos 2-3 litros de água por dia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Faça refeições a cada 3-4 horas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Evite alimentos processados e açúcares</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Priorize proteínas magras e vegetais</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progresso Tab */}
          <TabsContent value="progresso" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <span className="font-medium">Dias Completados</span>
                    <span className="text-2xl font-bold text-blue-600">{currentDay - 1}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <span className="font-medium">Sequência Atual</span>
                    <span className="text-2xl font-bold text-green-600">{streak} 🔥</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <span className="font-medium">Dias Restantes</span>
                    <span className="text-2xl font-bold text-purple-600">{30 - currentDay + 1}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${currentDay >= 1 ? 'bg-yellow-50 dark:bg-yellow-950' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}>
                    <Trophy className={`w-8 h-8 ${currentDay >= 1 ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-bold">Primeiro Passo</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Complete o dia 1</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${currentDay >= 7 ? 'bg-yellow-50 dark:bg-yellow-950' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}>
                    <Trophy className={`w-8 h-8 ${currentDay >= 7 ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-bold">Primeira Semana</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Complete 7 dias</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${currentDay >= 15 ? 'bg-yellow-50 dark:bg-yellow-950' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}>
                    <Trophy className={`w-8 h-8 ${currentDay >= 15 ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-bold">Meio Caminho</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Complete 15 dias</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${currentDay >= 30 ? 'bg-yellow-50 dark:bg-yellow-950' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}>
                    <Trophy className={`w-8 h-8 ${currentDay >= 30 ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-bold">Transformação Completa</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Complete 30 dias</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Seu Objetivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Peso Atual</p>
                      <p className="text-2xl font-bold">{userData.weight}kg</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Altura</p>
                      <p className="text-2xl font-bold">{userData.height}cm</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Idade</p>
                      <p className="text-2xl font-bold">{userData.age}</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Objetivo</p>
                      <p className="text-xl font-bold capitalize">{userData.goal}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Continue Assim! 💪</h3>
                    <p className="text-blue-100">
                      Você está no caminho certo. Consistência é a chave para resultados reais. 
                      Mantenha o foco e você verá mudanças significativas em 30 dias!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
