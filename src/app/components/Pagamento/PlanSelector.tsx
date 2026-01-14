"use client";

import { PlanCard, type Plan } from "./PlanCard";

interface PlanSelectorProps {
  plans: Plan[];
  selectedPlan: Plan | null;
  onSelectPlan: (plan: Plan) => void;
}

export function PlanSelector({ plans, selectedPlan, onSelectPlan }: PlanSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-text-primary text-xl font-bold">Escolha seu plano</h2>
      <div className="grid gap-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan?.id === plan.id}
            onSelect={onSelectPlan}
          />
        ))}
      </div>
    </div>
  );
}

export type { Plan };