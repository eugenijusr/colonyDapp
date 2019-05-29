/* @flow */

import { defineMessages } from 'react-intl';
import styles from './FourOFour.css';

const MSG = defineMessages({
  assignmentFunding: {
    id: 'dashboard.Task.assignmentFunding',
    defaultMessage: 'Assignment and funding',
  },
  details: {
    id: 'dashboard.Task.details',
    defaultMessage: 'Details',
  },
});


const displayName = 'dashboard.FourOFour';

const FourOFour = () => {

  return (
    <div class="hero">
    <div class="hero-wrapper">
      <h1 class="title">404!</h1>
      <p class="description">Something went wrong! Have you tried turning it off and on again?</p>
      <svg viewBox="0 0 660 350" class="naked-mole">
        <style type="text/css">
        	.st0{fill:#00284B;}
        	.st1{fill:#F0F5F7;}
        	.st2{fill:#F2ADBD;}
        	.st3{fill:#F8D0D8;}
        	.st4{fill:#F5416E;}
        	.st5{fill:#FFFFFF;}
        </style>
        <path class="st0" d="m 184.34,231.84 v 60.57 H 177.1 V 231.84 H 68.15 v -8.89 L 173.16,59.35 h 11.19 v 165.9 h 38.84 v 6.58 H 184.34 Z M 177.1,67.26 h -0.99 l -101.71,158 h 102.7 z" /><path class="st0" d="m 330.49,296.36 c -14.93,0 -27.1,-3.79 -36.54,-11.36 -9.44,-7.57 -16.79,-17.17 -22.05,-28.8 -5.27,-11.63 -8.89,-24.57 -10.86,-38.84 -1.98,-14.26 -2.96,-28.09 -2.96,-41.48 0,-13.38 0.99,-27.21 2.96,-41.48 1.98,-14.26 5.6,-27.21 10.86,-38.84 5.27,-11.63 12.62,-21.23 22.05,-28.8 9.43,-7.57 21.61,-11.36 36.54,-11.36 14.92,0 27.1,3.79 36.54,11.36 9.43,7.57 16.79,17.17 22.05,28.8 5.27,11.63 8.89,24.58 10.86,38.84 1.97,14.27 2.96,28.09 2.96,41.48 0,13.39 -0.99,27.21 -2.96,41.48 -1.98,14.27 -5.6,27.21 -10.86,38.84 -5.27,11.63 -12.62,21.23 -22.05,28.8 -9.44,7.57 -21.62,11.36 -36.54,11.36 z m 0,-234.37 c -9.88,0 -18.38,2.03 -25.51,6.09 -7.13,4.06 -13.12,9.33 -17.94,15.8 -4.83,6.48 -8.67,13.83 -11.52,22.05 -2.85,8.23 -5.05,16.57 -6.58,25.02 -1.54,8.45 -2.53,16.62 -2.96,24.52 -0.44,7.9 -0.66,14.71 -0.66,20.41 0,5.93 0.22,12.79 0.66,20.57 0.44,7.79 1.42,15.91 2.96,24.36 1.53,8.45 3.73,16.79 6.58,25.02 2.85,8.23 6.69,15.58 11.52,22.05 4.82,6.48 10.81,11.74 17.94,15.8 7.13,4.06 15.64,6.09 25.51,6.09 9.88,0 18.38,-2.03 25.51,-6.09 7.13,-4.06 13.11,-9.33 17.94,-15.8 4.82,-6.47 8.67,-13.83 11.52,-22.05 2.85,-8.23 5.04,-16.57 6.58,-25.02 1.53,-8.45 2.52,-16.57 2.96,-24.36 0.44,-7.79 0.66,-14.65 0.66,-20.57 0,-5.7 -0.22,-12.51 -0.66,-20.41 -0.44,-7.9 -1.43,-16.07 -2.96,-24.52 -1.54,-8.45 -3.73,-16.79 -6.58,-25.02 C 382.6,97.7 378.76,90.35 373.94,83.88 369.11,77.41 363.13,72.14 356,68.08 348.87,64.02 340.37,61.99 330.49,61.99 Z" /><path class="st0" d="m 553.01,231.84 v 60.57 h -7.24 V 231.84 H 436.81 v -8.89 L 541.82,59.35 h 11.19 v 165.9 h 38.84 v 6.58 H 553.01 Z M 545.77,67.26 h -0.99 l -101.71,158 h 102.7 z" /><path class="st1" d="m 624.91,293.23 c -49.15,4.79 -98.3,7.29 -147.45,8.97 l -18.43,0.67 -18.43,0.43 -36.86,0.81 c -12.29,0.25 -24.58,0.31 -36.86,0.47 L 330,304.73 c -49.15,0.02 -98.3,-0.87 -147.45,-2.56 -49.15,-1.69 -98.3,-4.18 -147.45,-8.94 v -1.35 l 73.73,-0.33 73.73,-0.12 147.44,-0.22 147.45,0.23 73.73,0.12 73.73,0.33 z" /><path class="st2" d="m 434.78,284.76 c 0,0 -3.26,11.54 -18.35,11.54 -15.09,0 -35.82,0 -35.82,0 z" /><path class="st2" d="m 282.18,294.78 c -0.19,-0.06 -0.37,-0.13 -0.56,-0.2 -0.1,-0.02 -0.2,-0.06 -0.3,-0.11 -4.36,-1.64 -8.38,-3.96 -11.83,-6.91 -1.19,-1.01 -2.32,-2.1 -3.36,-3.27 -1.66,2.4 -4.14,4.01 -6.63,5.1 -2.04,0.89 -4.09,1.42 -5.7,1.74 -1.84,0.36 -3.17,1.96 -3.17,3.84 v 3.1 h 4.76 c 1.77,0 3.49,-0.6 4.87,-1.71 l 0.37,-0.29 v 2 c 0.26,-0.06 31.78,0 31.78,0 z" /><path class="st3" d="M 472.85,282.54 V 293 c 0,4.31 -3.49,7.8 -7.8,7.8 h -4.2 v -2 l -0.36,0.29 c -1.37,1.11 -3.08,1.71 -4.85,1.71 h -5.79 v -2 l -0.36,0.29 c -1.37,1.11 -3.08,1.71 -4.85,1.71 h -4.79 v -3.1 c 0,-1.88 1.33,-3.48 3.17,-3.84 5.04,-0.99 14.33,-4.09 14.33,-13.56 v -3 c 0,0 -4.92,4.57 -14,8 -16.99,6.42 -52.56,14.06 -87.57,14.92 -2.14,0.05 -4.29,0.08 -6.43,0.08 l -6.66,8.88 c -1.47,1.96 -3.78,3.12 -6.24,3.12 h -3.35 v -2 l -0.36,0.29 c -1.37,1.11 -3.08,1.71 -4.85,1.71 h -5.74 v -2 l -0.36,0.29 c -1.37,1.11 -3.08,1.71 -4.85,1.71 h -5.75 v -2 l -0.34,0.27 c -1.39,1.12 -3.12,1.73 -4.9,1.73 h -3.6 v -3.17 c 0,-2.05 1.58,-3.76 3.62,-3.9 5.33,-0.36 15.12,-2.13 19.38,-9.93 0,0 -14,4.2 -32,4.2 -3.81,0 -7.59,-0.45 -11.22,-1.33 -1.59,-0.37 -3.14,-0.84 -4.66,-1.39 l -0.86,-0.31 c -4.36,-1.64 -8.38,-3.96 -11.83,-6.91 -1.19,-1.01 -2.32,-2.1 -3.36,-3.27 -0.95,-1.04 -1.82,-2.15 -2.63,-3.32 -0.49,-0.71 -0.95,-1.44 -1.38,-2.19 -2.16,-3.7 -3.63,-7.91 -4.24,-12.59 -1.54,-11.82 3,-23.08 11.27,-30.86 2.21,-2.09 4.68,-3.93 7.38,-5.46 4.12,-2.34 8.77,-3.97 13.77,-4.69 0.01,0 0.01,0 0.02,0 0.18,-0.03 0.37,-0.06 0.55,-0.08 0,0 0,0 0.01,-0.01 0.21,-0.07 3.52,-1.32 8.01,-2.86 0.2,-0.06 0.4,-0.13 0.6,-0.2 0.82,-0.28 1.68,-0.57 2.57,-0.86 1.86,-0.61 3.84,-1.25 5.81,-1.85 0.5,-0.15 0.99,-0.3 1.49,-0.44 0.07,-0.02 0.14,-0.04 0.21,-0.06 2.84,-0.83 5.61,-1.54 7.99,-2.02 0.05,-0.01 0.09,-0.02 0.14,-0.03 10.03,-2.16 28.06,-21.97 69.86,-21.97 35.32,0 68.52,22.63 83.54,55.41 4.35,9.5 6.46,19.88 6.46,30.33 z" /><path d="m 289.5,267.86 c 0.73,1.25 0.6,2.67 -0.13,3.71 -0.27,0.39 -0.85,0.41 -1.15,0.04 l -0.02,-0.02 c -0.21,-0.26 -0.2,-0.61 -0.02,-0.89 0.32,-0.47 0.42,-1.06 0.24,-1.65 -0.18,-0.62 -0.69,-1.11 -1.32,-1.28 -1.29,-0.34 -2.45,0.62 -2.45,1.86 v 0.95 h -0.91 c -0.31,0 -0.56,-0.25 -0.56,-0.56 v -0.32 c 0,-0.93 -0.63,-1.79 -1.55,-1.97 -1.23,-0.24 -2.3,0.7 -2.3,1.89 0,0.39 0.11,0.75 0.32,1.06 0.19,0.28 0.2,0.64 -0.02,0.9 l -0.02,0.02 c -0.3,0.37 -0.88,0.35 -1.15,-0.04 -0.65,-0.93 -0.81,-2.17 -0.33,-3.31 0.43,-1.02 1.38,-1.76 2.46,-1.96 1.33,-0.25 2.56,0.29 3.3,1.23 0.79,-1 2.12,-1.55 3.56,-1.17 0.9,0.22 1.61,0.75 2.05,1.51 z" class="st4" /><path d="m 267.24999,264.92001 a 2.4200001,2.4200001 0 0 1 -2.42,2.42 2.4200001,2.4200001 0 0 1 -2.42,-2.42 2.4200001,2.4200001 0 0 1 2.42,-2.42 2.4200001,2.4200001 0 0 1 2.42,2.42 z" /><path d="m 308.92,260.64001 a 2.4200001,2.4200001 0 0 1 -2.42,2.42 2.4200001,2.4200001 0 0 1 -2.42,-2.42 2.4200001,2.4200001 0 0 1 2.42,-2.42 2.4200001,2.4200001 0 0 1 2.42,2.42 z" /><path class="st4" d="m 291.3,277.43 c 0.42,0 0.74,0.31 0.68,0.65 -0.44,2.37 -3.27,4.26 -6.86,4.62 -0.41,0.04 -0.47,-2.24 -0.89,-2.24 -0.22,0 -0.78,2.29 -1,2.28 -3.88,-0.2 -6.99,-2.17 -7.46,-4.67 -0.06,-0.34 0.26,-0.65 0.68,-0.65 h 14.85 z" /><path class="st2" d="m 323.6,284.81 c 1.46,-0.96 2.8,-2.11 3.95,-3.4 1.18,-1.26 2.19,-2.67 2.98,-4.17 0.81,-1.5 1.29,-3.12 1.87,-4.69 0.34,-0.78 0.55,-1.6 0.86,-2.41 0.29,-0.82 0.49,-1.66 0.88,-2.52 l 0.2,0.01 c 0.41,1.79 0.41,3.69 -0.02,5.49 -0.35,1.84 -1.4,3.45 -2.42,4.96 -1.03,1.52 -2.27,2.88 -3.65,4.06 -1.4,1.15 -2.9,2.16 -4.56,2.86 z" /><path class="st2" d="m 301.79,226.84 c 2.42,1.39 6.31,4.75 6.58,5.01 0.27,0.26 0.26,0.8 -0.27,0.29 -0.53,-0.51 -4.64,-2.64 -7.13,-3.47 -2.48,-0.87 -5.02,-1.45 -7.57,-1.69 -2.21,-0.21 -5.9,0.01 -7.79,0.2 0.18,-0.03 0.37,-0.06 0.55,-0.08 0,0 0,0 0.01,-0.01 0.21,-0.07 3.52,-1.32 8.01,-2.86 0,0 2.38,-0.65 7.61,2.61 z" /><path class="st2" d="m 309.09,225.2 c -0.49,-0.27 -3.03,-1.34 -4.6,-1.68 -1.56,-0.38 -3.1,-0.59 -4.61,-0.62 -0.87,-0.02 -1.71,0.15 -2.53,0.27 1.86,-0.61 3.84,-1.25 5.81,-1.85 1.17,0.18 2.2,0.48 2.9,0.81 1.65,0.78 3.17,2.38 3.37,2.69 0.2,0.31 0.15,0.65 -0.34,0.38 z" /><path class="st2" d="m 349.35,300.3 c 2.14,0 4.29,-0.03 6.43,-0.08 l 1.01,-1.75 1.15,-2.11 c 0.4,-0.69 0.76,-1.41 1.12,-2.12 0.36,-0.71 0.73,-1.41 1.05,-2.14 0.66,-1.45 1.25,-2.92 1.82,-4.39 1.05,-2.98 2.02,-5.98 2.6,-9.08 l -0.48,-0.14 c -1.32,2.8 -2.7,5.56 -4.37,8.14 -1.88,2.89 -10.33,13.67 -10.33,13.67 z" /><path class="st2" d="m 338.64,280.47 c 1.28,-2.22 2.2,-4.64 2.84,-7.1 0.67,-2.46 1.09,-4.97 1.22,-7.5 0.05,-0.63 0.02,-1.26 0.03,-1.89 0.01,-0.63 0,-1.26 -0.07,-1.89 -0.04,-0.63 -0.08,-1.26 -0.09,-1.88 -0.06,-0.63 -0.1,-1.25 -0.14,-1.88 -0.01,-0.63 -0.04,-1.26 -0.13,-1.89 -0.05,-0.63 -0.12,-1.26 -0.15,-1.9 -0.11,-1.27 -0.3,-2.54 -0.32,-3.87 l 0.19,-0.06 c 0.58,1.18 1.12,2.39 1.51,3.65 0.35,1.27 0.73,2.54 0.88,3.86 0.49,2.62 0.16,5.3 -0.12,7.91 -0.33,2.62 -0.98,5.18 -1.86,7.65 -0.93,2.45 -2.06,4.82 -3.63,6.91 z" /><path class="st2" d="m 340.13,288.72 c 3.07,-2.43 5.37,-5.69 7.08,-9.15 1.73,-3.47 2.77,-7.23 3.3,-11.05 l 0.29,-2.88 c 0.04,-0.96 0.01,-1.93 0.02,-2.89 l 0.02,-1.44 c 0,-0.48 -0.07,-0.96 -0.09,-1.44 -0.06,-0.96 -0.09,-1.93 -0.12,-2.89 0,-0.97 -0.18,-1.92 -0.25,-2.89 -0.08,-0.97 -0.18,-1.93 -0.25,-2.91 -0.31,-1.92 -0.56,-3.86 -0.74,-5.85 l 0.19,-0.05 c 0.71,1.85 1.36,3.73 1.93,5.64 0.41,1.94 0.86,3.9 1.11,5.88 0.14,2 0.38,4 0.18,6 -0.08,1 -0.12,2 -0.23,3 l -0.47,2.97 c -0.75,3.93 -2.03,7.78 -4,11.26 -2,3.44 -4.57,6.6 -7.86,8.85 z" /><path class="st2" d="m 410.72,272.5 c 3.1,-2.28 5.9,-4.61 8.56,-7.05 2.65,-2.44 5.17,-4.95 7.5,-7.65 0.61,-0.64 1.14,-1.37 1.72,-2.05 l 0.87,-1.02 c 0.28,-0.34 0.53,-0.72 0.81,-1.07 0.55,-0.71 1.09,-1.42 1.66,-2.12 0.51,-0.74 1.03,-1.47 1.57,-2.21 1.13,-1.43 2.03,-3.01 3.15,-4.51 1.06,-1.53 2.01,-3.13 3.23,-4.68 -0.08,0.96 -0.23,1.91 -0.39,2.86 -0.17,0.95 -0.31,1.92 -0.6,2.83 -0.58,1.83 -1.1,3.71 -1.97,5.44 -0.41,0.88 -0.82,1.76 -1.26,2.62 -0.48,0.84 -1,1.66 -1.51,2.49 -0.49,0.84 -1.08,1.62 -1.67,2.4 -0.61,0.76 -1.17,1.56 -1.83,2.28 -2.56,2.95 -5.61,5.48 -8.93,7.51 -3.35,2.01 -7.02,3.57 -10.91,3.93 z" /><path class="st2" d="m 424.79,273.56 c 2.28,-1.62 4.34,-3.33 6.28,-5.15 1.94,-1.82 3.76,-3.72 5.43,-5.76 0.44,-0.49 0.81,-1.04 1.22,-1.55 0.42,-0.51 0.82,-1.03 1.19,-1.58 0.38,-0.54 0.76,-1.08 1.16,-1.61 l 1.08,-1.68 c 0.77,-1.1 1.4,-2.28 2.13,-3.43 0.72,-1.16 1.31,-2.38 2.11,-3.56 -0.16,1.38 -0.4,2.77 -0.75,4.13 -0.44,1.32 -0.78,2.71 -1.41,3.97 -0.29,0.64 -0.58,1.29 -0.89,1.92 -0.34,0.62 -0.71,1.22 -1.06,1.84 -0.35,0.62 -0.76,1.2 -1.17,1.77 -0.43,0.56 -0.82,1.16 -1.29,1.7 -1.8,2.2 -3.94,4.12 -6.29,5.7 -2.36,1.54 -4.95,2.82 -7.74,3.29 z" /><path class="st2" d="m 442.3,268.07 c 1.04,-1.2 1.97,-2.29 2.86,-3.39 0.89,-1.09 1.73,-2.17 2.53,-3.29 0.78,-1.13 1.6,-2.24 2.36,-3.44 0.43,-0.58 0.76,-1.21 1.21,-1.81 0.43,-0.61 0.8,-1.26 1.34,-1.88 0.21,1.58 0.05,3.17 -0.4,4.67 -0.41,1.52 -1.17,2.93 -2.08,4.23 -0.92,1.29 -2.09,2.4 -3.4,3.28 -1.31,0.86 -2.8,1.53 -4.42,1.63 z" /><path class="st5" d="m 291.24,292.48 -1.91,-0.07 c -0.7,-0.03 -1.36,-0.32 -1.85,-0.83 l -2.15,-2.24 c -0.43,-0.46 -0.7,-1.06 -0.74,-1.69 l -0.32,-5.09 -0.25,0.01 v 5.87 c 0,0.53 0.18,1.05 0.51,1.46 l 2.02,2.58 -1.91,-0.07 c -0.7,-0.03 -1.36,-0.32 -1.84,-0.83 l -2.16,-2.24 c -0.43,-0.46 -0.7,-1.06 -0.74,-1.69 l -0.6,-9.64 c -0.04,-0.63 0.35,-1.21 0.96,-1.41 l 0.89,-0.28 c 0.26,-0.08 0.53,-0.09 0.79,-0.02 l 1.69,0.48 c 0.23,0.06 0.44,0.18 0.61,0.35 0.17,-0.24 0.41,-0.43 0.71,-0.53 l 0.89,-0.28 c 0.26,-0.08 0.53,-0.09 0.79,-0.02 l 1.07,0.3 c 0.6,0.16 1.01,0.71 1.01,1.33 v 10.51 c 0,0.53 0.18,1.05 0.51,1.46 z"/>
      </svg>
    </div>
  </div>
  );
};

FourOFour.displayName = displayName;

export default FourOFour;
