import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DistributionChartProps {
  title: string;
  description: string;
  data: Array<{ name: string; value: number }>;
  color?: string;
}

export function DistributionChart({ title, description, data, color = "hsl(214, 84%, 56%)" }: DistributionChartProps) {
  return (
    <Card className="shadow-corporate">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-12 text-center">Sin datos disponibles</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fontSize: 11 }}
                tickFormatter={(v: string) => (v.length > 22 ? `${v.slice(0, 22)}…` : v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill={color} name="Registros" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
