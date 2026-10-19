import { BusinessInput, GeneratedOutput } from "../types";
import { calculateTierPricing } from "../utils";
import { generateClinicsTemplate } from "./clinics";
import { generateGeneralServicesTemplate } from "./generalServices";
import { generateHospitalityTemplate } from "./hospitality";
import { generateWellnessTemplate } from "./wellness";

export {
  generateClinicsTemplate,
  generateGeneralServicesTemplate,
  generateHospitalityTemplate,
  generateWellnessTemplate,
};

export function generateDeliverables(input: BusinessInput): GeneratedOutput {
  const pricing = calculateTierPricing(input.targetPriceAnchor, input.targetPriceFloor, input.currency || "USD");

  let result;
  switch (input.niche) {
    case "hospitality":
      result = generateHospitalityTemplate(input, pricing);
      break;
    case "wellness":
      result = generateWellnessTemplate(input, pricing);
      break;
    case "clinics":
      result = generateClinicsTemplate(input, pricing);
      break;
    case "general_services":
    default:
      result = generateGeneralServicesTemplate(input, pricing);
      break;
  }

  return {
    ...result,
    pricing,
  };
}

