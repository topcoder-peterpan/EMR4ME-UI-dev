interface FRS {
  gender: string;
  age: number;
  hdl: number;
  cholesterol: number;
  bloodPressure: number;
  bloodPressureTreated: boolean;
  smoker: boolean;
  diabetes: boolean;
}

interface asthmaRS {
  gender: string; // male || female
  age: number;
  race: string; // Non-Hispanic White || Hispanic || Black || Asian || Pacific Islander || American Indian || Other
  BMI: number;
  oralContraceptives?: boolean;
}

interface strokeRS {
  gender: string; // male || female
  age: number;
  education: string; // "secondary" || "secondary diploma" || "postsecondary diploma"
  renalDisease: boolean;
  diabetes: boolean;
  congestiveHeartFailure: boolean;
  peripheralArterialDisease: boolean;
  highBloodPressure: boolean;
  ischemicHeartDisease: boolean;
  smoking?: boolean; // true if currently smoking
  formerSmoker?: boolean;
  alcoholicDrinks: number; // number per drinks per week
  formerDrinker?: boolean;
  physicalActivity: number; //times of being active per week
  indicatorsOfAnger: boolean;
  depression: boolean;
  anxiety: boolean;
}

class RiskCalculation {
  asthmaRS = (params: asthmaRS) => {
    let percentage: number = 100; //percentage of refrence HR = 1 (Hazard ratio) for BMI < 25 (kg/m^2)
    if (params.BMI < 25) {
      return {
        percentage: percentage,
      };
    } else if (params.BMI >= 25 && params.BMI <= 29.9) {
      // -----------BMI = [25 - 29.9] -----------
      if (params.gender === undefined) {
        // -----------undefined gender -----------

        // -----------age points -----------
        if (params.age <= 39) {
          percentage += 3;
        } else if (params.age >= 40 && params.age <= 65) percentage += 18;
        else if (params.age >= 40 && params.age <= 65) percentage += 25;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 13;
        else if (params.race === 'Hispanic') percentage += 7;
        else if (params.race === 'Black') percentage += 1;
        else if (params.race === 'Asian') percentage += 23;
        else if (params.race === 'Pacific Islander') percentage += 0;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 13;
        else if (params.race === 'Other' || params.race === undefined) percentage += 8;
      } else if (params.gender === 'male') {
        // ----------- male -----------

        // -----------age points -----------
        if (params.age <= 39) percentage -= 2;
        else if (params.age >= 40 && params.age <= 65) percentage += 13;
        else if (params.age >= 40 && params.age <= 65) percentage += 20;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 9;
        else if (params.race === 'Hispanic') percentage -= 3;
        else if (params.race === 'Black') percentage -= 5;
        else if (params.race === 'Asian') percentage += 20;
        else if (params.race === 'Pacific Islander') percentage -= 1;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage -= 17;
        else if (params.race === 'Other' || params.race === undefined) percentage += 4;
      } else if (params.gender === 'female') {
        // ----------- female -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 5;
        else if (params.age >= 40 && params.age <= 65) percentage += 19;
        else if (params.age >= 40 && params.age <= 65) percentage += 27;

        // ----------- race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 14;
        else if (params.race === 'Hispanic') percentage += 11;
        else if (params.race === 'Black') percentage += 4;
        else if (params.race === 'Asian') percentage += 26;
        else if (params.race === 'Pacific Islander') percentage -= 1;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 29;
        else if (params.race === 'Other' || params.race === undefined) percentage += 10;

        // ----------- Oral Contraceptives -----------
        if (params.oralContraceptives) percentage += 9;
        else percentage += 19;
      }
    } else if (params.BMI >= 30 && params.BMI <= 34.9) {
      // -----------BMI = [30 - 34.9] -----------
      if (params.gender === undefined) {
        // -----------undefined gender -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 18;
        else if (params.age >= 40 && params.age <= 65) percentage += 46;
        else if (params.age >= 40 && params.age <= 65) percentage += 65;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 38;
        else if (params.race === 'Hispanic') percentage += 29;
        else if (params.race === 'Black') percentage += 22;
        else if (params.race === 'Asian') percentage += 62;
        else if (params.race === 'Pacific Islander') percentage += 21;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 32;
        else if (params.race === 'Other' || params.race === undefined) percentage += 32;
      } else if (params.gender === 'male') {
        // ----------- male -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 10;
        else if (params.age >= 40 && params.age <= 65) percentage += 35;
        else if (params.age >= 40 && params.age <= 65) percentage += 50;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 28;
        else if (params.race === 'Hispanic') percentage += 13;
        else if (params.race === 'Black') percentage += 11;
        else if (params.race === 'Asian') percentage += 56;
        else if (params.race === 'Pacific Islander') percentage += 12;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 0;
        else if (params.race === 'Other' || params.race === undefined) percentage += 19;
      } else if (params.gender === 'female') {
        // ----------- female -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 23;
        else if (params.age >= 40 && params.age <= 65) percentage += 51;
        else if (params.age >= 40 && params.age <= 65) percentage += 74;

        // ----------- race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 44;
        else if (params.race === 'Hispanic') percentage += 36;
        else if (params.race === 'Black') percentage += 29;
        else if (params.race === 'Asian') percentage += 65;
        else if (params.race === 'Pacific Islander') percentage += 26;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 48;
        else if (params.race === 'Other' || params.race === undefined) percentage += 43;

        // ----------- Oral Contraceptives -----------
        if (params.oralContraceptives) percentage += 34;
        else percentage += 51;
      }
    } else if (params.BMI >= 35 && params.BMI <= 39.9) {
      // -----------BMI = [35 - 39.9] -----------

      if (params.gender === undefined) {
        // -----------undefined gender -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 34;
        else if (params.age >= 40 && params.age <= 65) percentage += 77;
        else if (params.age >= 40 && params.age <= 65) percentage += 111;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 65;
        else if (params.race === 'Hispanic') percentage += 59;
        else if (params.race === 'Black') percentage += 41;
        else if (params.race === 'Asian') percentage += 108;
        else if (params.race === 'Pacific Islander') percentage += 39;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 58;
        else if (params.race === 'Other' || params.race === undefined) percentage += 56;
      } else if (params.gender === 'male') {
        // ----------- male -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 20;
        else if (params.age >= 40 && params.age <= 65) percentage += 63;
        else if (params.age >= 40 && params.age <= 65) percentage += 96;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 54;
        else if (params.race === 'Hispanic') percentage += 39;
        else if (params.race === 'Black') percentage += 16;
        else if (params.race === 'Asian') percentage += 114;
        else if (params.race === 'Pacific Islander') percentage += 20;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 30;
        else if (params.race === 'Other' || params.race === undefined) percentage += 38;
      } else if (params.gender === 'female') {
        // ----------- female -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 42;
        else if (params.age >= 40 && params.age <= 65) percentage += 82;
        else if (params.age >= 40 && params.age <= 65) percentage += 118;

        // ----------- race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 70;
        else if (params.race === 'Hispanic') percentage += 68;
        else if (params.race === 'Black') percentage += 53;
        else if (params.race === 'Asian') percentage += 105;
        else if (params.race === 'Pacific Islander') percentage += 51;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 71;
        else if (params.race === 'Other' || params.race === undefined) percentage += 69;

        // ----------- Oral Contraceptives -----------
        if (params.oralContraceptives) percentage += 54;
        else percentage += 84;
      }
    } else if (params.BMI >= 40 && params.BMI <= 49.9) {
      // -----------BMI = [40 - 49.9] -----------

      if (params.gender === undefined) {
        // -----------undefined gender -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 57;
        else if (params.age >= 40 && params.age <= 65) percentage += 117;
        else if (params.age >= 40 && params.age <= 65) percentage += 147;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 99;
        else if (params.race === 'Hispanic') percentage += 90;
        else if (params.race === 'Black') percentage += 69;
        else if (params.race === 'Asian') percentage += 134;
        else if (params.race === 'Pacific Islander') percentage += 44;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 114;
        else if (params.race === 'Other' || params.race === undefined) percentage += 95;
      } else if (params.gender === 'male') {
        // ----------- male -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 39;
        else if (params.age >= 40 && params.age <= 65) percentage += 96;
        else if (params.age >= 40 && params.age <= 65) percentage += 146;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 85;
        else if (params.race === 'Hispanic') percentage += 61;
        else if (params.race === 'Black') percentage += 39;
        else if (params.race === 'Asian') percentage += 118;
        else if (params.race === 'Pacific Islander') percentage += 25;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 62;
        else if (params.race === 'Other' || params.race === undefined) percentage += 74;
      } else if (params.gender === 'female') {
        // ----------- female -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 66;
        else if (params.age >= 40 && params.age <= 65) percentage += 125;
        else if (params.age >= 40 && params.age <= 65) percentage += 148;

        // ----------- race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 105;
        else if (params.race === 'Hispanic') percentage += 101;
        else if (params.race === 'Black') percentage += 82;
        else if (params.race === 'Asian') percentage += 142;
        else if (params.race === 'Pacific Islander') percentage += 55;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 137;
        else if (params.race === 'Other' || params.race === undefined) percentage += 109;

        // ----------- Oral Contraceptives -----------
        if (params.oralContraceptives) percentage += 80;
        else percentage += 123;
      }
    } else if (params.BMI >= 50) {
      // -----------BMI >= 50 -----------

      if (params.gender === undefined) {
        // -----------undefined gender -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 89;
        else if (params.age >= 40 && params.age <= 65) percentage += 179;
        else if (params.age >= 40 && params.age <= 65) percentage += 252;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 155;
        else if (params.race === 'Hispanic') percentage += 129;
        else if (params.race === 'Black') percentage += 104;
        else if (params.race === 'Asian') percentage += 345;
        else if (params.race === 'Pacific Islander') percentage += 107;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 161;
        else if (params.race === 'Other' || params.race === undefined) percentage += 142;
      } else if (params.gender === 'male') {
        // ----------- male -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 66;
        else if (params.age >= 40 && params.age <= 65) percentage += 148;
        else if (params.age >= 40 && params.age <= 65) percentage += 229;

        // -----------race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 117;
        else if (params.race === 'Hispanic') percentage += 84;
        else if (params.race === 'Black') percentage += 68;
        else if (params.race === 'Asian') percentage += 341;
        else if (params.race === 'Pacific Islander') percentage += 108;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 155;
        else if (params.race === 'Other' || params.race === undefined) percentage += 255;
      } else if (params.gender === 'female') {
        // ----------- female -----------

        // -----------age points -----------
        if (params.age <= 39) percentage += 99;
        else if (params.age >= 40 && params.age <= 65) percentage += 188;
        else if (params.age >= 40 && params.age <= 65) percentage += 260;

        // ----------- race points -----------
        if (params.race === 'Non-Hispanic White') percentage += 168;
        else if (params.race === 'Hispanic') percentage += 146;
        else if (params.race === 'Black') percentage += 118;
        else if (params.race === 'Asian') percentage += 344;
        else if (params.race === 'Pacific Islander') percentage += 104;
        else if (params.race === 'American Indian' || params.race === 'American native') percentage += 173;
        else if (params.race === 'Other' || params.race === undefined) percentage += 86;

        // ----------- Oral Contraceptives -----------
        if (params.oralContraceptives) percentage += 106;
        else percentage += 197;
      }
    }

    return {
      percentage: percentage,
    };
  };

  strokeRS = (params: strokeRS) => {
    let score: number = 0;
    let percentage: string = '';
    if (params.age > 20) score += params.age - 20;
    if (params.gender === 'male') score += 3;
    if (params.education === 'secondary') score += 4;
    else if (params.education === 'secondary diploma') score += 3;
    if (params.renalDisease) score += 8;
    if (params.diabetes) score += 7;
    if (params.congestiveHeartFailure) score += 5;
    if (params.peripheralArterialDisease) score += 2;
    if (params.highBloodPressure) score += 2;
    if (params.ischemicHeartDisease) score += 1;
    // smoking
    if (params.smoking) score += 8;
    else if (params.formerSmoker) score += 5;
    // level of alcohol consumption
    if (params.alcoholicDrinks >= 7) score += 3;
    else if (params.formerDrinker) score += 5;
    else if (params.alcoholicDrinks === 0 && !params.formerDrinker) score += 2;
    // level of activity
    if (params.physicalActivity === 0) score += 2;
    else if (params.physicalActivity === 1 || params.physicalActivity === 2) score += 1;

    if (params.indicatorsOfAnger) score += 4;
    if (params.depression) score += 4;
    if (params.indicatorsOfAnger) score += 3;

    // calculating the percentage of 10-year stroke risk
    if (score < 50) percentage = '<3%';
    else if (score < 75) percentage = '<28%';
    else if (score < 90) percentage = '<75%';
    else if (score >= 90) percentage = '>75%';

    return {
      percentage: percentage,
    };
  };

  FRS = (params: FRS) => {
    let score: number = 0;
    let percentage: string = '';

    // HDL-C (mmol/L) points
    if (params.hdl > 1.6) score += -2;
    else if (params.hdl <= 1.6 && params.hdl >= 1.3) score += -1;
    else if (params.hdl <= 1.29 && params.hdl >= 1.2) score += 0;
    else if (params.hdl <= 1.19 && params.hdl >= 0.9) score += 1;
    else if (params.hdl < 0.9) score += 2;

    if (params.gender === 'male') {
      // ----------- male ----------

      // Age Points
      if (params.age < 34) score += 0;
      else if (params.age >= 35 && params.age <= 39) score += 2;
      else if (params.age >= 40 && params.age <= 44) score += 5;
      else if (params.age >= 45 && params.age <= 49) score += 7;
      else if (params.age >= 50 && params.age <= 54) score += 8;
      else if (params.age >= 55 && params.age <= 59) score += 10;
      else if (params.age >= 60 && params.age <= 64) score += 11;
      else if (params.age >= 65 && params.age <= 69) score += 12;
      else if (params.age >= 70 && params.age <= 74) score += 14;
      else if (params.age > 74) score += 15;

      // Total Cholesterol Points
      if (params.cholesterol < 4.1) score += 0;
      else if (params.cholesterol >= 4.1 && params.cholesterol <= 5.19) score += 1;
      else if (params.cholesterol >= 5.2 && params.cholesterol <= 6.19) score += 2;
      else if (params.cholesterol >= 6.2 && params.cholesterol <= 7.2) score += 3;
      else if (params.cholesterol > 7.2) score += 4;

      // Systolic Blood Pressure Points
      if (params.bloodPressure < 120) score += params.bloodPressureTreated ? 0 : -2;
      else if (params.bloodPressure >= 120 && params.bloodPressure <= 129) score += params.bloodPressureTreated ? 2 : 0;
      else if (params.bloodPressure >= 130 && params.bloodPressure <= 139) score += params.bloodPressureTreated ? 3 : 1;
      else if (params.bloodPressure >= 140 && params.bloodPressure <= 149) score += params.bloodPressureTreated ? 4 : 2;
      else if (params.bloodPressure >= 150 && params.bloodPressure <= 159) score += params.bloodPressureTreated ? 4 : 2;
      else if (params.bloodPressure > 160) score += params.bloodPressureTreated ? 5 : 3;

      // Smoking Points
      score += params.smoker ? 4 : 0;

      if (score <= -3) percentage = '1';
      else if (score === -2) percentage = '1.1';
      else if (score === -1) percentage = '1.4';
      else if (score === 0) percentage = '1.6';
      else if (score === 1) percentage = '1.9';
      else if (score === 2) percentage = '2.3';
      else if (score === 3) percentage = '2.8';
      else if (score === 4) percentage = '3.3';
      else if (score === 5) percentage = '3.9';
      else if (score === 6) percentage = '4.7';
      else if (score === 7) percentage = '5.6';
      else if (score === 8) percentage = '6.7';
      else if (score === 9) percentage = '7.9';
      else if (score === 10) percentage = '9.4';
      else if (score === 11) percentage = '11.2';
      else if (score === 12) percentage = '13.3';
      else if (score === 13) percentage = '15.6';
      else if (score === 14) percentage = '18.4';
      else if (score === 15) percentage = '21.6';
      else if (score === 16) percentage = '25.3';
      else if (score === 17) percentage = '29.4';
      else if (score >= 18) percentage = '30';
    } else {
      // ----------- Female ----------

      // Age Points
      if (params.age < 34) score += 0;
      else if (params.age >= 35 && params.age <= 39) score += 2;
      else if (params.age >= 40 && params.age <= 44) score += 4;
      else if (params.age >= 45 && params.age <= 49) score += 5;
      else if (params.age >= 50 && params.age <= 54) score += 7;
      else if (params.age >= 55 && params.age <= 59) score += 8;
      else if (params.age >= 60 && params.age <= 64) score += 9;
      else if (params.age >= 65 && params.age <= 69) score += 10;
      else if (params.age >= 70 && params.age <= 74) score += 11;
      else if (params.age > 74) score += 12;

      // Total Cholesterol Points
      if (params.cholesterol < 4.1) score += 0;
      else if (params.cholesterol >= 4.1 && params.cholesterol <= 5.19) score += 1;
      else if (params.cholesterol >= 5.2 && params.cholesterol <= 6.19) score += 3;
      else if (params.cholesterol >= 6.2 && params.cholesterol <= 7.2) score += 4;
      else if (params.cholesterol > 7.2) score += 5;

      // Systolic Blood Pressure Points
      if (params.bloodPressure < 120) score += params.bloodPressureTreated ? -1 : -3;
      else if (params.bloodPressure >= 120 && params.bloodPressure <= 129) score += params.bloodPressureTreated ? 2 : 0;
      else if (params.bloodPressure >= 130 && params.bloodPressure <= 139) score += params.bloodPressureTreated ? 3 : 1;
      else if (params.bloodPressure >= 140 && params.bloodPressure <= 149) score += params.bloodPressureTreated ? 5 : 2;
      else if (params.bloodPressure >= 150 && params.bloodPressure <= 159) score += params.bloodPressureTreated ? 6 : 4;
      else if (params.bloodPressure > 160) score += params.bloodPressureTreated ? 7 : 5;

      // Smoking Points
      score += params.smoker ? 3 : 0;

      if (score <= -2) percentage = '1';
      else if (score === -1) percentage = '1.0';
      else if (score === 0) percentage = '1.2';
      else if (score === 1) percentage = '1.5';
      else if (score === 2) percentage = '1.7';
      else if (score === 3) percentage = '2.0';
      else if (score === 4) percentage = '2.4';
      else if (score === 5) percentage = '2.8';
      else if (score === 6) percentage = '3.3';
      else if (score === 7) percentage = '3.9';
      else if (score === 8) percentage = '4.5';
      else if (score === 9) percentage = '5.3';
      else if (score === 10) percentage = '6.3';
      else if (score === 11) percentage = '7.3';
      else if (score === 12) percentage = '8.6';
      else if (score === 13) percentage = '10.0';
      else if (score === 14) percentage = '11.7';
      else if (score === 15) percentage = '13.7';
      else if (score === 16) percentage = '15.9';
      else if (score === 17) percentage = '18.51';
      else if (score === 18) percentage = '21.5';
      else if (score === 19) percentage = '24.8';
      else if (score === 20) percentage = '27.5';
      else if (score >= 21) percentage = '30';
    }

    return {
      percentage: percentage,
    };
  };
}

export const RiskPrediction = new RiskCalculation();
