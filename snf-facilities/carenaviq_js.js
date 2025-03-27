/***** 2) PAGE SETUP / UTILITIES *****/
 const currentDate = new Date();
 const currentYear = currentDate.getFullYear();
 const lastUpdatedDate = new Date(currentDate);
 lastUpdatedDate.setDate(currentDate.getDate() - 6);

 function formatDate(date) {
   return date.toLocaleDateString("en-US", {
     month: "long",
     day: "numeric",
     year: "numeric"
   });
 }

 // Populate footer timestamps
 document.getElementById("last-updated").textContent =
   `Last Updated: ${formatDate(lastUpdatedDate)}`;
 document.getElementById("footer-last-updated").textContent =
   `Last Updated: ${formatDate(currentDate)}`;
 document.getElementById("copyright").textContent =
   `© ${currentYear} CARE NAVIQ. All rights reserved.`;

 // Breadcrumb / Title
 const fd = facilityData.facility_details;
 document.getElementById("breadcrumb-state").textContent = fd.state;
 document.getElementById("breadcrumb-county").textContent = fd.county;
 document.getElementById("breadcrumb-facility").textContent = fd.name;
 document.title = `CARE NAVIQ - ${fd.name} Dashboard`;

 // Facility Header
 document.getElementById("facility-name").textContent = fd.name;
 document.getElementById("address").textContent =
   `${fd.address}, ${fd.city}, ${fd.state} ${fd.zip}`;
 document.getElementById("provider-type").innerHTML =
   `<i class="fas fa-check-circle mr-2"></i>${fd.provider_type}`;
 document.getElementById("ccn").textContent = fd.ccn;
 document.getElementById("affiliated_entity_name").textContent = fd.affiliated_entity_name;

 /***** 3) METRICS - BEDS & OCCUPANCY *****/
 document.getElementById("beds").textContent = fd.certified_beds;
 document.getElementById("occupancy").textContent = `${fd.occupancy_rate}%`;
 document.getElementById("occupancy-bar").style.width = `${fd.occupancy_rate}%`;
 document.getElementById("census").textContent = fd.average_daily_census;

 /***** 4) FINANCIAL METRICS *****/
 const fs = facilityData.financial_strength || {};

 // Revenue/PD
 if (fs.revenue_per_patient_day !== undefined) {
   document.getElementById("revenue-ppd").textContent =
     `$${parseFloat(fs.revenue_per_patient_day).toFixed(2)}`;
 } else {
   document.getElementById("revenue-ppd").textContent = "N/A";
 }

 // Operating Margin
 if (fs.operating_margin !== undefined) {
   document.getElementById("margin").textContent =
     parseFloat(fs.operating_margin).toFixed(2);
 } else {
   document.getElementById("margin").textContent = "N/A";
 }

 /***** 5) OWNERSHIP *****/
 document.getElementById("ownership").textContent = fd.ownership_type || "N/A";
 const certDateObj = fd.medicare_medicaid_date
   ? new Date(fd.medicare_medicaid_date)
   : null;
 document.getElementById("cert-date").textContent =
   certDateObj ? certDateObj.toLocaleDateString() : "N/A";

 // Certification Badges
 const providerTypeStr = (fd.provider_type || "").toLowerCase();
 const badgesContainer = document.getElementById("certification-badges");
 if (providerTypeStr.includes("medicare")) {
   badgesContainer.innerHTML +=
     '<span class="badge-primary mr-2"><i class="fas fa-check-circle mr-1"></i> Medicare</span>';
 }
 if (providerTypeStr.includes("medicaid")) {
   badgesContainer.innerHTML +=
     '<span class="badge-secondary"><i class="fas fa-check-circle mr-1"></i> Medicaid</span>';
 }

 /***** 6) STAFFING *****/
 const cs = facilityData.clinical_strength || {};
 const staffHours = cs.staffing_hours_per_resident ?? 0;
 const rnHours = cs.rn_staffing_hours ?? 0;

 document.getElementById("staff-hours").textContent = staffHours.toFixed(2);
 document.getElementById("rn-hours-small").textContent = rnHours.toFixed(2);

 // Simple rating
 const staffRating = document.getElementById("staff-rating");
 if (staffHours >= 4.5) {
   staffRating.innerHTML = '<i class="fas fa-star mr-1"></i> Above Average';
   staffRating.className = "stat-badge badge-secondary text-xs";
 } else if (staffHours >= 3.5) {
   staffRating.innerHTML = '<i class="fas fa-star-half-alt mr-1"></i> Average';
   staffRating.className = "stat-badge badge-primary text-xs";
 } else {
   staffRating.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i> Below Average';
   staffRating.className = "stat-badge badge-danger text-xs";
 }

 // Clinical details
 document.getElementById("total-staff-hours").textContent = staffHours.toFixed(2);
 document.getElementById("staff-hours-bar").style.width =
   `${Math.min(staffHours * 20, 100)}%`;
 document.getElementById("rn-hours").textContent = rnHours.toFixed(2);
 document.getElementById("rn-hours-bar").style.width =
   `${Math.min(rnHours * 50, 100)}%`;

 const totalDef = cs.total_deficiencies ?? 0;
 document.getElementById("deficiencies").textContent = totalDef;
 document.getElementById("deficiency-bar").style.width =
   `${Math.min(totalDef * 5, 100)}%`;
 document.getElementById("infection-def").textContent =
   cs.infection_control_deficiencies ?? 0;

 const turnover = cs.total_staff_turnover ?? 0;
 document.getElementById("staff-turnover").textContent = `${turnover}%`;
 document.getElementById("turnover-bar").style.width = `${turnover}%`;

 const rnTurn = cs.rn_turnover_rate ?? 0;
 document.getElementById("rn-turnover").textContent = rnTurn.toFixed(2);

 /***** 7) FINANCIAL OVERVIEW (Cash, Ratio) *****/
 if (fs.cash_position !== undefined) {
   document.getElementById("cash").textContent =
     `$${parseFloat(fs.cash_position).toLocaleString()}`;
 } else {
   document.getElementById("cash").textContent = "N/A";
 }

 if (fs.current_ratio !== undefined) {
   document.getElementById("ratio").textContent =
     parseFloat(fs.current_ratio).toFixed(2);
 } else {
   document.getElementById("ratio").textContent = "N/A";
 }

 /***** 8) NETWORK METRICS (Payer Mix, Admissions/Discharges) *****/
 const ns = facilityData.network_strength || {};

 // Payer Mix chart
 const pm = ns.payer_mix || {
   medicare_percent: 0,
   medicaid_percent: 0,
   other_percent: 0
 };
 new Chart(document.getElementById("payerMixChart"), {
   type: "doughnut",
   data: {
     labels: ["Medicare", "Medicaid", "Other"],
     datasets: [
       {
         data: [
           parseFloat(pm.medicare_percent),
           parseFloat(pm.medicaid_percent),
           parseFloat(pm.other_percent)
         ],
         backgroundColor: ["#9cc474", "#5a8b3f", "#eeeed2"],
         borderWidth: 0,
         borderRadius: 4
       }
     ]
   },
   options: {
     responsive: true,
     maintainAspectRatio: false,
     cutout: "70%",
     plugins: {
       legend: {
         position: "bottom",
         labels: {
           boxWidth: 12,
           padding: 15,
           usePointStyle: true,
           font: { family: "'Poppins', sans-serif" }
         }
       }
     }
   }
 });

 // Admissions / Discharges chart
 document.getElementById("admissions").textContent = ns.admissions_volume ?? "N/A";
 document.getElementById("discharges").textContent = ns.discharges_volume ?? "N/A";

 new Chart(document.getElementById("admissionsChart"), {
   type: "bar",
   data: {
     labels: ["Admissions", "Discharges"],
     datasets: [
       {
         label: "Volume",
         data: [
           ns.admissions_volume ?? 0,
           ns.discharges_volume ?? 0
         ],
         backgroundColor: ["#5a8b3f", "#eeeed2"],
         borderRadius: 6
       }
     ]
   },
   options: {
     responsive: true,
     maintainAspectRatio: false,
     scales: {
       y: {
         beginAtZero: true,
         grid: {
           display: true,
           color: "rgba(0, 0, 0, 0.05)"
         }
       },
       x: {
         grid: {
           display: false
         }
       }
     },
     plugins: {
       legend: {
         display: false
       }
     }
   }
 });

 /***** 9) LOCATION & MARKET INFO *****/
 function formatPhoneNumber(phone) {
   const cleaned = ("" + phone).replace(/\D/g, "");
   const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
   if (match) {
     return `(${match[1]}) ${match[2]}-${match[3]}`;
   }
   return phone || "N/A";
 }

 document.getElementById("county").textContent = fd.county || "N/A";
 document.getElementById("phone").textContent = formatPhoneNumber(fd.phone);
 document.getElementById("county-pop").textContent =
   fd.county_population ? fd.county_population.toLocaleString() : "N/A";
 document.getElementById("elder-pop").textContent =
   fd.county_elder_population ? fd.county_elder_population.toLocaleString() : "N/A";
 document.getElementById("median-income").textContent =
   fd.county_median_income
     ? `$${fd.county_median_income.toLocaleString()}`
     : "N/A";
 document.getElementById("rural").textContent = fd.is_rural ? "Yes" : "No";
 document.getElementById("in-hospital").textContent =
   fd.in_hospital === "N" ? "No" : "Yes";
 document.getElementById("ccrc").textContent =
   fd.ccrc === "N" ? "No" : "Yes";
 document.getElementById("sprinkler").textContent =
   fd.sprinkler_system || "N/A";
 document.getElementById("ownership-change").textContent =
   fd.changed_ownership_last_12mo === "N" ? "No" : "Yes";
 document.getElementById("special-focus").textContent = fd.special_focus || "None";

 // Leaflet Map
 const map = L.map("map").setView([fd.location.latitude, fd.location.longitude], 13);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
   attribution:
     '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
 }).addTo(map);

 const facilityIcon = L.divIcon({
   html: '<i class="fas fa-building text-2xl" style="color: #769656;"></i>',
   className: "bg-white rounded-full p-2 shadow-md",
   iconSize: [40, 40],
   iconAnchor: [20, 20]
 });

 L.marker([fd.location.latitude, fd.location.longitude], { icon: facilityIcon })
   .addTo(map)
   .bindPopup(`
     <div class="p-2">
       <div class="font-bold">${fd.name}</div>
       <div class="text-sm">${fd.address}</div>
       <div class="text-sm">${fd.city}, ${fd.state} ${fd.zip}</div>
     </div>
   `)
   .openPopup();

 /***** 10) CBSA COMPARE (Integer parse fix) *****/
 const cbsaCode = fd.cbsa_code;   // e.g. "37860.0"
 const cbsaName = fd.cbsa_name;   // e.g. "Pensacola-Ferry Pass-Brent, FL"
 document.getElementById("cbsa-name").textContent = cbsaName;

 if (fd.is_rural) {
   // If rural, skip the compare
   document.getElementById('cbsa-facilities-container').innerHTML = `
     <div class="p-4 rounded-lg" style="background-color: #f0f0f0;">
       <p class="text-center" style="color: #666633;">
         <i class="fas fa-tree mr-2"></i>
         This facility is in a rural area.
         No comparable CBSA data available.
       </p>
     </div>
   `;
 } else {
   const normalizedCbsaCode = parseInt(cbsaCode);  // parse from string w/ decimals

   fetch('https://raw.githubusercontent.com/Net-RVA/snf-data/refs/heads/main/data.json')
.then(response => response.json())
.then(data => {
 // Use data.facilities if the file has { facilities: [...] }, else data
 const allFacilities = data.facilities || data;

 // Filter for matching CBSA, excluding same facility name
 const matchingFacilities = allFacilities.filter(f => {
   if (!f.facility_details || !f.facility_details.cbsa_code) return false;

   const facilityCbsaInt = parseInt(f.facility_details.cbsa_code);
   const isSameCbsa = facilityCbsaInt === normalizedCbsaCode;
   const isDifferentName = f.facility_details.name !== fd.name;

   return isSameCbsa && isDifferentName;
 }).slice(0, 6);

 const facilitiesList = document.getElementById('cbsa-facilities-list');
 if (!matchingFacilities.length) {
   facilitiesList.innerHTML = `
     <p class="text-center" style="color: #666633;">
       No other facilities found in this CBSA.
     </p>
   `;
   return;
 }

 // We'll do a small table
 facilitiesList.innerHTML = `
   <div class="overflow-x-auto">
     <table class="w-full border-collapse text-sm">
       <thead>
         <tr class="bg-gray-100">
           <th class="p-2 text-left border-b">Facility</th>
           <th class="p-2 text-center border-b">Beds</th>
           <th class="p-2 text-center border-b">Occupancy</th>
           <th class="p-2 text-center border-b">Revenue/PD</th>
           <th class="p-2 text-center border-b">Staffing Hours</th>
           <th class="p-2 text-center border-b">Payer Mix</th>
         </tr>
       </thead>
       <tbody id="cbsa-facilities-tbody"></tbody>
     </table>
   </div>
 `;
 const tbody = document.getElementById('cbsa-facilities-tbody');

 // Current facility references
 const currentOcc = fs.occupancy_rate ?? 0;
 const currentRev = fs.revenue_per_patient_day ?? 0;
 const currentStaff = cs.staffing_hours_per_resident ?? 0;
 const currentPm = ns.payer_mix || {};

 function getComparisonClass(curVal, compareVal, higherIsBetter = true) {
   if (curVal == null || compareVal == null) return '';
   if (higherIsBetter) {
     return compareVal > curVal ? 'text-green-600' : compareVal < curVal ? 'text-red-600' : '';
   } else {
     return compareVal < curVal ? 'text-green-600' : compareVal > curVal ? 'text-red-600' : '';
   }
 }
 function formatNum(num, dec=2) {
   if (num == null) return 'N/A';
   return parseFloat(num).toFixed(dec);
 }

 // Insert current facility row first (unchanged, no link needed)
 const currentRow = document.createElement('tr');
 currentRow.className = 'bg-green-50';
 currentRow.innerHTML = `
   <td class="p-2 border-b font-semibold">
     <div class="flex items-center">
       <i class="fas fa-building mr-2 text-green-600"></i>
       <span class="truncate">${fd.name}</span>
     </div>
   </td>
   <td class="p-2 border-b text-center">${fd.certified_beds ?? 'N/A'}</td>
   <td class="p-2 border-b text-center">${formatNum(currentOcc)}%</td>
   <td class="p-2 border-b text-center">$${formatNum(currentRev)}</td>
   <td class="p-2 border-b text-center">${formatNum(currentStaff)}</td>
   <td class="p-2 border-b">
     <div class="flex justify-center space-x-1 text-xs">
       <span class="bg-blue-100 px-1 rounded" title="Medicare">
         M: ${formatNum(currentPm.medicare_percent)}%
       </span>
       <span class="bg-green-100 px-1 rounded" title="Medicaid">
         Md: ${formatNum(currentPm.medicaid_percent)}%
       </span>
       <span class="bg-yellow-100 px-1 rounded" title="Other">
         O: ${formatNum(currentPm.other_percent)}%
       </span>
     </div>
   </td>
 `;
 tbody.appendChild(currentRow);

 // Now each matching facility with a link to entity name
 matchingFacilities.forEach(f => {
   const ffd = f.facility_details || {};
   const fFin = f.financial_strength || {};
   const fClin = f.clinical_strength || {};
   const fNet = f.network_strength || {};
   const fMix = fNet.payer_mix || {};

   const occRate = fFin.occupancy_rate ?? 0;
   const revPd = fFin.revenue_per_patient_day ?? 0;
   const staffH = fClin.staffing_hours_per_resident ?? 0;

   const occClass = getComparisonClass(currentOcc, occRate, true);
   const revClass = getComparisonClass(currentRev, revPd, true);
   const staffClass = getComparisonClass(currentStaff, staffH, true);

   // Build the URL using affiliated_entity_name instead of facility name
   const entityNameEncoded = encodeURIComponent(ffd.affiliated_entity_name ?? 'N/A');
   const searchUrl = `/snf-entity-search.html?query=${entityNameEncoded}`;

   const row = document.createElement('tr');
   row.className = 'hover:bg-gray-50';
   row.innerHTML = `
     <td class="p-2 border-b">
       <div class="flex items-center">
         <i class="fas fa-building mr-2 text-gray-500"></i>
         <a href="${searchUrl}" class="truncate text-blue-600 hover:underline" title="${ffd.name ?? 'N/A'}">
           ${ffd.name ?? 'N/A'}
         </a>
       </div>
     </td>
     <td class="p-2 border-b text-center">${ffd.certified_beds ?? 'N/A'}</td>
     <td class="p-2 border-b text-center ${occClass}">${formatNum(occRate)}%</td>
     <td class="p-2 border-b text-center ${revClass}">$${formatNum(revPd)}</td>
     <td class="p-2 border-b text-center ${staffClass}">${formatNum(staffH)}</td>
     <td class="p-2 border-b">
       <div class="flex justify-center space-x-1 text-xs">
         <span class="bg-blue-100 px-1 rounded" title="Medicare">
           M: ${formatNum(fMix.medicare_percent)}%
         </span>
         <span class="bg-green-100 px-1 rounded" title="Medicaid">
           Md: ${formatNum(fMix.medicaid_percent)}%
         </span>
         <span class="bg-yellow-100 px-1 rounded" title="Other">
           O: ${formatNum(fMix.other_percent)}%
         </span>
       </div>
     </td>
   `;
   tbody.appendChild(row);
 });

 // Optional legend (unchanged)
 facilitiesList.insertAdjacentHTML('beforeend', `
   <div class="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
     <div class="flex items-center justify-center space-x-4">
       <span class="flex items-center">
         <i class="fas fa-circle text-green-600 mr-1"></i>
         Better than current facility
       </span>
       <span class="flex items-center">
         <i class="fas fa-circle text-red-600 mr-1"></i>
         Worse than current facility
       </span>
     </div>
   </div>
 `);
})
.catch(error => {
 console.error("Error fetching data.json:", error);
 document.getElementById("cbsa-facilities-list").innerHTML = `
   <p class="text-center text-red-600">
     <i class="fas fa-exclamation-triangle mr-1"></i>
     Error loading CBSA data. ${error.message}
   </p>
 `;
});
 }

 /***** 11) TAB SWITCHING *****/
 document.querySelectorAll(".tab").forEach(tab => {
   tab.addEventListener("click", function() {
     document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
     this.classList.add("active");
   });
 });

 /***** 12) PDF EXPORT *****/
 document.getElementById("export-pdf-btn").addEventListener("click", () => {
   const navbar = document.querySelector(".sticky.top-0");
   const breadcrumbs = document.querySelector(".breadcrumbs.text-sm");
   const topButtonSection = document.querySelector(".flex.justify-between.items-center.mb-6");
   const extraButtons = document.querySelector(".bg-white.p-4.rounded-lg.shadow-sm.mb-10");
   const footer = document.querySelector("footer");

   // Save original display
   const origNav = navbar.style.display;
   const origBc = breadcrumbs.style.display;
   const origTop = topButtonSection.style.display;
   const origExtra = extraButtons.style.display;
   const origFoot = footer.style.display;

   // Hide
   navbar.style.display = "none";
   breadcrumbs.style.display = "none";
   topButtonSection.style.display = "none";
   extraButtons.style.display = "none";
   footer.style.display = "none";

   // Calculate PDF dimensions
   const pageWidth = document.documentElement.scrollWidth;
   const pageHeight = document.documentElement.scrollHeight;

   const opt = {
     margin: 0.5,
     filename: `SNF_Guru_${fd.name}_${formatDate(currentDate)}.pdf`,
     image: { type: "jpeg", quality: 0.98 },
     html2canvas: {
       scale: 1,
       windowWidth: pageWidth,
       windowHeight: pageHeight,
       useCORS: true
     },
     jsPDF: {
       unit: "px",
       format: [pageWidth, pageHeight],
       orientation: "portrait"
     }
   };

   html2pdf()
     .from(document.body)
     .set(opt)
     .save()
     .then(() => {
       // Restore
       navbar.style.display = origNav;
       breadcrumbs.style.display = origBc;
       topButtonSection.style.display = origTop;
       extraButtons.style.display = origExtra;
       footer.style.display = origFoot;
     });
 });