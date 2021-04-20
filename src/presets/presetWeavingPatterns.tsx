import { LoomStateStringRepresentation } from "../types";

export const patterns : Array<LoomStateStringRepresentation> = [
    {
      name: "Basic Twill",
      data: {
        threading:  "1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4"
      }
    },
    {
      name: "Periwinkle",
      data: {
        threading:  "3,2,1,4,3,2,1,4,3,4,3,2,3,2,1,4,3,4,1,2,3,2,3,4,3,4,1,2",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "3,2,1,4x3,3x3,2,1,4x2,1,2,3x3,4x3,1,2,3"
      }
    },
    {
      name: "Diadem",
      data: {
        threading:  "4,1,2,3,4,1,2,3,4,1,2,3,2,3,2,1,4,3,4,3,4,1,2,3,2,3,2,1,4,3,2,1,4,3,2,1,4,1",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "3x2,4,1,2,3,4,1,2,3,4,1x4,4,3,2x4,3,4,1x4,4,3,2,1,4,3,2,1,4,3x2"
      }
    },
    {
      name: "Rings and Chains",
      data: {
        threading:  "1,2,3,4,1,2,3,4,1,2,3,4,1,4,1,4,3,4,3,2,3,2,1,2,1,4,1,2,1,4,1,2,1,4,1,2,1,4,1,2,1,4,1,2,1,4,1,2,1,2,3,2,3,4,3,4,1,4,1,4,3,2,1,4,1,2,3,4",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "1,2,3,4,1x4,4x3,3x3,2x3,1x2,2x2,1x2,2x2,1x2,2x2,1x2,2x2,1x2,2x2,1x2,2x3,3x3,4x3,1x4,4,3,2,1"
      }
    },
    {
      name: "Wheel of Fortune",
      data: {
        threading:  "1,2,3,4,1,2,1,2,3,2,3,4,3,4,1,4,3,4,1,4,3,4,3,2,3,2,1,2,1,4,3,2,1,4,3,2,1,4,3,2,3,2,1,2,1,4,1,4,3,4,1,4,3,4,1,4,1,2,1,2,3,2,3,4,1,2,3,4",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "2,3,4,1,2x3,3x3,4x3,1x2,4x2,1x2,4x3,3x3,2x3,1,4,3,2,1,4,3,2,1,4,3x3,2x3,1x3,4x2,1x2,4x2,1x3,2x3,3x3,4,1,2,3,4,1"
      }
    },
    {
      name: "Chariot Wheel No. 3",
      data: {
        threading:  "4,3,2,1,4,3,2,3,4,3,2,3,4,1,4,1,4,1,2,1,2,1,4,1,2,1,4,1,2,1,2,1,4,1,4,1,4,3,2,3,4,3,2,3,4,1,2,3",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "4,3,2,1,4,3x2,4x2,3x2,4,1x5,2x4,1x2,2x2,1x2,2x4,1x5,4,3x2,4x2,3x2,4,1,2,3,4"
      }
    },
    {
      name: "Chariot Wheel No. 3 Alt",
      data: {
        threading:  "4,3,2,1,4,3,2,3,4,3,2,3,4,1,4,1,4,1,2,1,2,1,4,1,2,1,4,1,2,1,2,1,4,1,4,1,4,3,2,3,4,3,2,3,4,1,2,3",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "3,4,1,2,3,4x2,3x2,4x2,3,2x5,1x4,2x2,1x2,2x2,1x4,2x5,3,4x2,3x2,4x2,3,2,1,4,3"
      }
    },
    {
      name: "Church Windows",
      data: {
        threading:  "3,2,1,4,3,4,3,4,1,4,1,2,1,4,1,4,3,4,3,4,1,2,3,2,1,2,3,2,1,2,3,2,1,2,3,2,1,2,3,2,1,2,3,2,1,4,3,4,3,4,1,4,1,2,1,4,1,4,3,4,3,4,2,1",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "3,2,1,4x4,1x3,2x2,1x3,4x4,1,2,3x2,2x2,3x2,2x2,3x2,2x2,3x2,2x2,3x2,2x2,3x2,2,1,4x4,1x3,2x2,1x3,4x4,1,2,3"
      }
    },
    {
      name: "Cambridge Beauty",
      data: {
        threading:  "2,3,4,1,4,1,4,1,4,3,4,3,4,3,2,3,2,3,2,1,2,1,2,1,2,3,4,3,2,1,2,3,4,3,2,1,2,3,4,3,2,1,2,3,4,3,2,1,2,1,2,1,2,3,2,3,2,3,4,3,4,3,4,1,4,1,4,1,4,3",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "3,4,1x6,4x5,3x5,2x6,3,4x2,3,2x2,3,4x2,3,2x2,3,4x2,3,2x2,3,4x2,3,2x2,3,4x2,3,2x6,3x5,4x5,1x6,4,3"
      }
    },
    {
      name: "Star of Bethlehem",
      data: {
        threading:  "2,3,4,1,2,3,4,1,2,3,4,1,2,1,2,3,2,3,4,3,4,1,4,1,2,3,4,1,4,3,2,1,4,1,4,3,4,3,2,3,2,1,2,1,4,3,2,1",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "2,3,4,1,2,3,4,1,2,3,4,1,2x3,3x3,4x3,1x3,1,2,3,4,1x2,4,3,2,1x3,4x3,3x3,2x3,1,4,3,2"
      }
    },
    {
      name: "Maltese Cross",
      data: {
        threading:  "1,2,3,4,1,2,3,4,1,2,3,4,1,2,1,4,1,4,3,4,3,2,3,2,1,2,1,4,1,2,1,4,1,2,1,2,3,2,3,4,3,4,1,4,1,2,1,4,3,2",
        tieup:      "1+4,1+2,2+3,3+4",
        treadling:  "2,1,4,3,2,1,4,3,2x2,3x3,4x3,1x3,2x3,3x2,2x2,3x2,2x3,1x3,4x3,3x3,2x2,3,4,1,2"
      }
    }
  ]
  