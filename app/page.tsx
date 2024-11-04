"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

interface WeightEntry {
  date: string;
  weight: number;
  user: {
    birthDate: Date;
    height: number;
  };
}

interface MacroBreakdown {
  protein: number;
  carbs: number;
  fats: number;
}

interface WeightInputProps {
  weight: string;
  setWeight: (weight: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  isToday: boolean;
}

interface WeightChartProps {
  data: WeightEntry[];
  isLoading: boolean;
}

interface MacroCardProps {
  title: string;
  amount: number;
  percentage: string;
  onClick: () => void;
}

interface MacroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMacro: string;
}

interface NutritionCardProps {
  targetCalories: number;
  macros: MacroBreakdown;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

// WeightInput Component
const WeightInput: React.FC<WeightInputProps> = ({
  weight,
  setWeight,
  isLoading,
  onSubmit,
  isToday,
}) => (
  <div className="flex gap-4 items-center w-full justify-center">
    <Input
      type="number"
      value={weight}
      onChange={(e) => setWeight(e.target.value)}
      placeholder="Enter weight (lbs)"
      className="max-w-[200px]"
      disabled={isLoading || isToday}
    />
    <Button onClick={onSubmit} disabled={isLoading || isToday}>
      {isLoading ? "Adding..." : isToday ? "Logged Today" : "Add Weight"}
    </Button>
  </div>
);

// Custom tooltip component that respects dark mode
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  const { resolvedTheme } = useTheme();
  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-lg border p-2 shadow-sm ${
          resolvedTheme === "dark"
            ? "bg-secondary text-secondary-foreground"
            : "bg-white text-foreground"
        }`}
      >
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          Weight:{" "}
          <span className="font-medium">{payload[0].value.toFixed(1)} lbs</span>
        </p>
      </div>
    );
  }
  return null;
};

// WeightChart Component
const WeightChart: React.FC<WeightChartProps> = ({ data, isLoading }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Calculate min and max for better Y axis range
  const weights = data.map((d) => d.weight);
  const minWeight = Math.floor(Math.min(...weights) - 5);
  const maxWeight = Math.ceil(Math.max(...weights) + 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isLoading ? "Loading weight..." : "Weight Progress"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Please wait while data loads.
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={
                    isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                  }
                />
                <XAxis
                  dataKey="date"
                  stroke={
                    isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
                  }
                  tick={{
                    fill: isDark
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(0, 0, 0, 0.8)",
                  }}
                  tickLine={{
                    stroke: isDark
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.2)",
                  }}
                />
                <YAxis
                  domain={[minWeight, maxWeight]}
                  stroke={
                    isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
                  }
                  tick={{
                    fill: isDark
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(0, 0, 0, 0.8)",
                  }}
                  tickLine={{
                    stroke: isDark
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{
                    fill: isDark ? "#fff" : "#000",
                    strokeWidth: 2,
                    stroke: "hsl(var(--primary))",
                    r: 4,
                  }}
                  activeDot={{
                    fill: "hsl(var(--primary))",
                    stroke: isDark ? "#fff" : "#000",
                    strokeWidth: 2,
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No weight data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const foodRecommendations = {
  protein: [
    {
      name: "Chicken Breast",
      details: "31g protein per 100g",
      tip: "Great lean protein source",
    },
    {
      name: "Eggs",
      details: "13g protein per 2 large eggs",
      tip: "Complete protein source",
    },
    {
      name: "Greek Yogurt",
      details: "10g protein per 100g",
      tip: "Good for breakfast or snacks",
    },
    {
      name: "Salmon",
      details: "25g protein per 100g",
      tip: "Rich in omega-3 fatty acids",
    },
    {
      name: "Tofu",
      details: "8g protein per 100g",
      tip: "Versatile plant-based option",
    },
  ],
  carbs: [
    {
      name: "Brown Rice",
      details: "23g carbs per 100g",
      tip: "High in fiber and nutrients",
    },
    {
      name: "Sweet Potatoes",
      details: "20g carbs per 100g",
      tip: "Rich in vitamins",
    },
    {
      name: "Oatmeal",
      details: "27g carbs per 100g",
      tip: "Great for sustained energy",
    },
    {
      name: "Quinoa",
      details: "21g carbs per 100g",
      tip: "Complete protein source",
    },
    {
      name: "Bananas",
      details: "23g carbs per medium banana",
      tip: "Quick energy source",
    },
  ],
  fats: [
    {
      name: "Avocado",
      details: "15g healthy fats per 100g",
      tip: "Rich in monounsaturated fats",
    },
    { name: "Nuts", details: "49g fats per 100g", tip: "Great snack option" },
    {
      name: "Olive Oil",
      details: "14g fats per tablespoon",
      tip: "Good for cooking",
    },
    { name: "Salmon", details: "13g fats per 100g", tip: "Omega-3 rich" },
    {
      name: "Chia Seeds",
      details: "31g fats per 100g",
      tip: "High in omega-3",
    },
  ],
};

const MacroDialog: React.FC<MacroDialogProps> = ({
  open,
  onOpenChange,
  selectedMacro,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="capitalize">
          Recommended {selectedMacro} Sources
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-4">
          {foodRecommendations[
            selectedMacro as keyof typeof foodRecommendations
          ]?.map((food) => (
            <div
              key={food.name}
              className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{food.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {food.details}
                  </p>
                  <p className="text-sm text-primary mt-1">💡 {food.tip}</p>
                </div>
                <Check className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

const MacroCard: React.FC<MacroCardProps> = ({
  title,
  amount,
  percentage,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-secondary p-4 rounded-lg cursor-pointer hover:bg-accent transition-colors"
  >
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-lg font-bold">{amount}g</p>
    <p className="text-xs text-muted-foreground">{percentage} of calories</p>
  </div>
);

interface NutritionCardProps {
  targetCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

// NutritionCard Component
const NutritionCard: React.FC<NutritionCardProps> = ({
  targetCalories,
  macros,
}) => {
  const [selectedMacro, setSelectedMacro] = React.useState<string>("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleMacroClick = (macro: string) => {
    setSelectedMacro(macro);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Daily Targets</h3>
              <p className="text-lg mb-2">
                Calories: <span className="font-bold">{targetCalories}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Based on your current weight with a moderate deficit for
                sustainable weight loss
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Macro Breakdown</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <MacroCard
                  title="Protein"
                  amount={macros.protein}
                  percentage="30%"
                  onClick={() => handleMacroClick("protein")}
                />
                <MacroCard
                  title="Carbohydrates"
                  amount={macros.carbs}
                  percentage="40%"
                  onClick={() => handleMacroClick("carbs")}
                />
                <MacroCard
                  title="Fats"
                  amount={macros.fats}
                  percentage="30%"
                  onClick={() => handleMacroClick("fats")}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                💡 Tip: Focus on lean proteins, complex carbs, and healthy fats.
                Spread your meals throughout the day and stay hydrated.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <MacroDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedMacro={selectedMacro}
      />
    </>
  );
};

// Helper functions
const calculateDailyCalories = (
  currentWeight: number,
  birthDate: Date,
  height: number
) => {
  const age = Math.floor(
    (new Date().getTime() - new Date(birthDate).getTime()) / 31557600000
  );
  const bmr = 10 * (currentWeight / 2.2) + 6.25 * (height * 2.54) - 5 * age + 5;
  const tdee = bmr * 1.2;
  return Math.round(tdee - 500);
};

const calculateMacros = (calories: number): MacroBreakdown => {
  const protein = Math.round((calories * 0.3) / 4);
  const carbs = Math.round((calories * 0.4) / 4);
  const fats = Math.round((calories * 0.3) / 9);
  return { protein, carbs, fats };
};

// Main WeightTracker component
const WeightTracker: React.FC = () => {
  const [weight, setWeight] = useState("");
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isToday, setIsToday] = useState(false);
  const { toast } = useToast();

  const fetchWeights = useCallback(async () => {
    try {
      const response = await fetch("/api/weights");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const formattedData = data.map((entry: WeightEntry) => ({
        date: new Date(entry.date).toLocaleDateString(),
        weight: entry.weight,
        user: entry.user,
      }));

      const today = new Date().toLocaleDateString();
      const hasTodayEntry = formattedData.some(
        (entry: { date: string }) => entry.date === today
      );
      setIsToday(hasTodayEntry);

      setWeightData(formattedData);
      setIsDataLoading(false);
    } catch (error) {
      console.error("Error fetching weights:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch weight data",
        variant: "destructive",
      });
      setIsDataLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWeights();
  }, [fetchWeights]);

  const handleAddWeight = async () => {
    if (!weight) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/weights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: parseFloat(weight) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to add weight");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setWeight("");
      await fetchWeights();
      toast({
        title: "Success",
        description: "Weight entry added successfully",
      });
    } catch (error) {
      console.error("Error adding weight:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add weight entry",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const latestWeight = weightData[weightData.length - 1]?.weight || 180;
  const targetCalories = calculateDailyCalories(
    latestWeight,
    weightData[weightData.length - 1]?.user?.birthDate ||
      new Date("1990-01-01"),
    weightData[weightData.length - 1]?.user?.height || 67
  );
  const macros = calculateMacros(targetCalories);

  return (
    <div className="space-y-4 p-4">
      <WeightInput
        weight={weight}
        setWeight={setWeight}
        isLoading={isLoading}
        onSubmit={handleAddWeight}
        isToday={isToday}
      />
      <WeightChart data={weightData} isLoading={isDataLoading} />
      <NutritionCard targetCalories={targetCalories} macros={macros} />
    </div>
  );
};

export default WeightTracker;
