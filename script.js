const R = 0.0821;
const T = 298;
const ANIMATION_DURATION = 1000;
const FPS = 60;
const frames = (ANIMATION_DURATION / 1000) * FPS;

function initSimulations() {
    const container1 = document.getElementById('container1');
    const container2 = document.getElementById('container2');

    container1.innerHTML = `
        <div class="membrane"></div>
        <div class="solution left" id="solutionA" style="height:50%"></div>
        <div class="solution right" id="solutionB" style="height:50%"></div>
        <div class="info" id="info1">
            <p>Initial Osmotic Pressure A: 0.00 atm</p>
            <p>Initial Osmotic Pressure B: 0.00 atm</p>
        </div>
    `;
    container2.innerHTML = `
        <div class="membrane vertical" id="membrane2" style="left:50%"></div>
        <div class="solution left" id="solutionC" style="width:50%"></div>
        <div class="solution right" id="solutionD" style="width:50%"></div>
        <div class="info" id="info2">
            <p>Membrane Distance from Left: 0.00 cm</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    initSimulations();
});

document.getElementById('startSim1').addEventListener('click', () => {
    const C_a = parseFloat(document.getElementById('C_a').value);
    const V_a = parseFloat(document.getElementById('V_a').value);
    const C_b = parseFloat(document.getElementById('C_b').value);
    const V_b = parseFloat(document.getElementById('V_b').value);

    if(isNaN(C_a) || isNaN(V_a) || isNaN(C_b) || isNaN(V_b) || V_a <= 0 || V_b <= 0 || C_a < 0 || C_b < 0) {
        alert('Please enter valid numerical values for all concentrations and volumes.');
        return;
    }

    const P_a = C_a * R * T;
    const P_b = C_b * R * T;

    const V_total = V_a + V_b;

    const h_a = (V_a / V_total) * 100;
    const h_b = (V_b / V_total) * 100;

    const container = document.getElementById('container1');
    container.innerHTML = `
        <div class="membrane"></div>
        <div class="solution left" id="solutionA" style="height:${h_a}%"></div>
        <div class="solution right" id="solutionB" style="height:${h_b}%"></div>
        <div class="info" id="info1">
            <p>Initial Osmotic Pressure A: ${P_a.toFixed(2)} atm</p>
            <p>Initial Osmotic Pressure B: ${P_b.toFixed(2)} atm</p>
        </div>
    `;

    if(P_a === P_b) return;

    const mA = C_a * V_a;
    const mB = C_b * V_b;

    let x = (mB * V_a - mA * V_b) / (mA + mB);

    if(x > V_a) {
        x = V_a;
    } else if(x < -V_b) {
        x = -V_b;
    }

    const V_a_final = V_a - x;
    const V_b_final = V_b + x;

    const C_a_final = mA / V_a_final;
    const C_b_final = mB / V_b_final;

    const P_a_final = C_a_final * R * T;
    const P_b_final = C_b_final * R * T;

    const h_a_final = (V_a_final / (V_a_final + V_b_final)) * 100;
    const h_b_final = (V_b_final / (V_a_final + V_b_final)) * 100;

    let curFrame = 0;

    const dh_a = (h_a_final - h_a) / frames;
    const dh_b = (h_b_final - h_b) / frames;
    const dP_a = (P_a_final - P_a) / frames;
    const dP_b = (P_b_final - P_b) / frames;

    let curH_a = h_a;
    let curH_b = h_b;
    let curP_a = P_a;
    let curP_b = P_b;

    const solutionA = document.getElementById('solutionA');
    const solutionB = document.getElementById('solutionB');
    const info = document.getElementById('info1');

    const animate = () => {
        if(curFrame <= frames) {
            curH_a += dh_a;
            curH_b += dh_b;
            solutionA.style.height = `${curH_a}%`;
            solutionB.style.height = `${curH_b}%`;

            curP_a += dP_a;
            curP_b += dP_b;

            info.innerHTML = `
                <p>Initial Osmotic Pressure A: ${P_a.toFixed(2)} atm</p>
                <p>Initial Osmotic Pressure B: ${P_b.toFixed(2)} atm</p>
                <p>Current Osmotic Pressure A: ${curP_a.toFixed(2)} atm</p>
                <p>Current Osmotic Pressure B: ${curP_b.toFixed(2)} atm</p>
            `;

            curFrame++;
            requestAnimationFrame(animate);
        } else {
            solutionA.style.height = `${h_a_final}%`;
            solutionB.style.height = `${h_b_final}%`;
            info.innerHTML = `
                <p>Initial Osmotic Pressure A: ${P_a.toFixed(2)} atm</p>
                <p>Initial Osmotic Pressure B: ${P_b.toFixed(2)} atm</p>
                <p>Final Osmotic Pressure A: ${P_a_final.toFixed(2)} atm</p>
                <p>Final Osmotic Pressure B: ${P_b_final.toFixed(2)} atm</p>
            `;
        }
    };

    animate();
});

document.getElementById('startSim2').addEventListener('click', () => {
    const C_c = parseFloat(document.getElementById('C_c').value);
    const V_c = parseFloat(document.getElementById('V_c').value);
    const C_d = parseFloat(document.getElementById('C_d').value);
    const V_d = parseFloat(document.getElementById('V_d').value);
    const l = parseFloat(document.getElementById('l').value);

    if(isNaN(C_c) || isNaN(V_c) || isNaN(C_d) || isNaN(V_d) || isNaN(l) || V_c <= 0 || V_d <= 0 || C_c < 0 || C_d < 0 || l <= 0) {
        alert('Please enter valid positive numerical values for all fields.');
        return;
    }

    const P_c = C_c * R * T;
    const P_d = C_d * R * T;

    const V_total = V_c + V_d;
    const memPos_percentage = (V_c / V_total) * 100;

    const memPos = (V_c / V_total) * l;

    if(P_c === P_d) {
        const container = document.getElementById('container2');
        container.innerHTML = `
            <div class="solution left" id="solutionC" style="width:${memPos_percentage}%"></div>
            <div class="solution right" id="solutionD" style="width:${100 - memPos_percentage}%"></div>
            <div class="membrane vertical" id="membrane2" style="left:${memPos_percentage}%"></div>
            <div class="info" id="info2">
                <p>Initial Osmotic Pressure C: ${P_c.toFixed(2)} atm</p>
                <p>Initial Osmotic Pressure D: ${P_d.toFixed(2)} atm</p>
                <p>Initial Membrane Distance: ${memPos.toFixed(2)} cm</p>
            </div>
        `;
        return;
    }

    const dV = (V_c * V_d * (C_c - C_d)) / (C_c * V_c + C_d * V_d);

    let finalV_c, finalV_d;

    if(dV > 0) {
        finalV_c = V_c + dV;
        finalV_d = V_d - dV;
    } else {
        finalV_c = V_c + dV;
        finalV_d = V_d - dV;
    }

    if(finalV_c <= 0 || finalV_d <= 0) {
        alert('Osmotic pressure difference causes invalid final volumes.');
        return;
    }

    const memPos_final = (finalV_c / (finalV_c + finalV_d)) * l;
    const memPos_final_percentage = (memPos_final / l) * 100;

    let targetPos = memPos_final_percentage;
    if(targetPos > 100) targetPos = 100;
    if(targetPos < 0) targetPos = 0;

    let curFrame = 0;

    const dPos = (targetPos - memPos_percentage) / frames;

    let curPos_percentage = memPos_percentage;

    const container = document.getElementById('container2');
    container.innerHTML = `
        <div class="solution left" id="solutionC" style="width:${memPos_percentage}%"></div>
        <div class="solution right" id="solutionD" style="width:${100 - memPos_percentage}%"></div>
        <div class="membrane vertical" id="membrane2" style="left:${memPos_percentage}%"></div>
        <div class="info" id="info2">
            <p>Membrane Distance from Left: ${memPos.toFixed(2)} cm</p>
        </div>
    `;

    const membrane = document.getElementById('membrane2');
    const solutionC = document.getElementById('solutionC');
    const solutionD = document.getElementById('solutionD');
    const info = document.getElementById('info2');

    const animate = () => {
        if(curFrame <= frames) {
            curPos_percentage += dPos;
            membrane.style.left = `${curPos_percentage}%`;

            const widthC = curPos_percentage;
            const widthD = 100 - curPos_percentage;
            solutionC.style.width = `${widthC}%`;
            solutionD.style.width = `${widthD}%`;

            const currentMembranePosition = (curPos_percentage / 100) * l;

            info.innerHTML = `
                <p>Initial Osmotic Pressure C: ${P_c.toFixed(2)} atm</p>
                <p>Initial Osmotic Pressure D: ${P_d.toFixed(2)} atm</p>
                <p>Current Membrane Distance: ${currentMembranePosition.toFixed(2)} cm</p>
            `;

            curFrame++;
            requestAnimationFrame(animate);
        } else {
            membrane.style.left = `${targetPos}%`;
            solutionC.style.width = `${targetPos}%`;
            solutionD.style.width = `${100 - targetPos}%`;

            const finalMembraneDistance = (targetPos / 100) * l;

            info.innerHTML = `
                <p>Initial Osmotic Pressure C: ${P_c.toFixed(2)} atm</p>
                <p>Initial Osmotic Pressure D: ${P_d.toFixed(2)} atm</p>
                <p>Final Membrane Distance: ${finalMembraneDistance.toFixed(2)} cm</p>
            `;
        }
    };

    animate();
});