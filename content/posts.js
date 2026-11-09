/* ====================================================================
   YOUR POSTS  -  this is the only file you edit to add content.

   HOW TO ADD A NEW POST
   1. Copy any post below (from "{" to "},") and paste it at the top of the list.
   2. Change the id (letters, numbers and dashes only, must be unique).
   3. Set type to "project", "thesis" or "blog".
   4. Write the body using the blocks listed here.

   BODY BLOCKS (use as many as you like, in any order)
     { h: "Section heading" }
     { h3: "Smaller heading" }
     { p: "A paragraph. You can use <b>bold</b>, <em>italic</em> and <a href='...'>links</a>." }
     { list: ["First point", "Second point"] }
     { olist: ["Step one", "Step two"] }
     { img: "images/my-photo.jpg", caption: "What the photo shows", alt: "Describe it for screen readers" }
     { gallery: [ { src: "images/a.jpg", caption: "A" }, { src: "images/b.jpg", caption: "B" } ] }
     { youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX", caption: "Optional caption" }
     { quote: "A quotation", by: "Who said it" }
     { code: "print('hello robot')" }
     { note: "A highlighted remark." }

   OPTIONAL POST FIELDS
     status:    "In progress"            shown next to the type
     dateLabel: "2020-2025"              replaces the date shown (date is still used for sorting)
     cover:     "images/cover.jpg"       image shown on the post and in lists
     video:     "https://youtu.be/..."   a video shown at the top of the post
     files:     [ { label: "Proposal (PDF)", url: "files/proposal.pdf" } ]
     featured:  true                     pins the post to the top of the home page
     draft:     true                     hides the post from lists; open it by its link to preview

   DATES: "2026-03-15", "2026-03" or "2026" all work. Newest posts come first.
==================================================================== */

const POSTS = [

  /* ---------------------------------------------------------------
     MSc THESIS
  --------------------------------------------------------------- */
  {
    id: "ucat-il-thesis",
    type: "thesis",
    status: "In progress",
    featured: true,
    title: "UCAT-IL: learning to handle deformable objects from monocular human demonstrations",
    date: "2026-09",
    summary: "My MSc thesis at Dong-Eui University: teaching a robot to manipulate ropes, cloth and other soft objects by watching a person on ordinary video.",
    tags: ["imitation learning", "deformable objects", "monocular vision", "physical AI"],
    body: [
      { h: "Overview" },
      { p: "UCAT-IL is the working name of my MSc thesis: <em>Uncertainty-Aware Contact and Topology-Guided Imitation Learning from Monocular Human Demonstrations for Deformable Object Manipulation</em>. The goal is to let a robot pick up a manipulation skill by watching a person perform it on ordinary video, and to cope with objects such as rope and cloth that change shape as they are handled." },
      { h: "What the name stands for" },
      { list: [
        "<b>Imitation learning.</b> The robot learns a skill from demonstrations instead of hand-written rules.",
        "<b>Monocular human demonstrations.</b> Demonstrations are recorded with a single camera, with no motion-capture suit and no robot teleoperation.",
        "<b>Deformable objects.</b> Ropes, cloth and other objects that have no fixed shape.",
        "<b>Contact and topology.</b> Where hands and tools touch the object, and how its structure changes (loops, crossings, folds), guide what the robot does next.",
        "<b>Uncertainty-aware.</b> The system estimates how far it can trust its own reading of the video."
      ] },
      { h: "Why this problem" },
      { p: "A single camera is cheap and easy to set up, which makes demonstrations easy to collect. It is also a difficult input: depth is missing, hands hide the object, and a deformable object can look very different from one moment to the next. Estimating uncertainty gives the robot a way to separate observations it can rely on from ones it cannot." },
      { h: "Progress" },
      { note: "Work started in September 2026. Literature notes, experiment logs, figures and videos will be added here as the thesis develops." }
    ]
  },

  /* ---------------------------------------------------------------
     PROJECTS AND EARLIER WORK
  --------------------------------------------------------------- */
  {
    id: "ekf-ros-mpu",
    type: "project",
    draft: false,
    title: "EKF Implementation in ROS 2 Environment",
    date: "2026-01",
    summary: "",
    tags: ["EKF", "ROS 2", "MPU 9250"],
    cover: "images/assembly.png",

    body: [
      { p: "I integrated the MPU9250 IMU sensor with Raspberry Pi 5 using I²C communication and developed ROS 2 Jazzy nodes in Python to acquire and publish real-time accelerometer, gyroscope, and magnetometer data. I implemented a quaternion-based Extended Kalman Filter (EKF) prototype incorporating gyroscope-based orientation prediction, covariance propagation, and accelerometer-based correction. I also established remote communication between Raspberry Pi and Foxglove Studio on macOS to visualize live sensor data." },
      { h: "Wire Diagram" },
      { img: "images/wiring_connection.png", caption: "Click any picture to view it full size." },
      { h: "Gallery" },
      { gallery: [
        { src: "images/MPU 9250.png", caption: "First view" },
        { src: "images/axis.png", caption: "Second view" }
      ] },
      { h: "Video" },
      { p: "" },
      { youtube: "https://youtu.be/Elt1oOgtfPo?si=6UMAbk401SBktawy", caption: "Video Demonstration" },

    ]
  }
  ,
  {
    id: "desk-study-partner",
    type: "project",
    draft: false,
    title: "Desk Study Partner with Concentration Mapper by Pomodoro Timer and Camera",
    date: "2025-09",
    summary: "We built a desktop study partner to maintain concentration and prepare an analysis report based on study time and eye movement by using camera and PIR motion sensor integrated with a Raspberry pi 5.",
    tags: ["Sensor Fusion", "Calibration", "Raspberry pi 5"],
    cover: "images/display.png",
    files: [ { label: "Manual", url: "files/manual.pdf" } ],
    body: [
      
      { h: "Pomodoro Timer" },
      { p: "The Pomodoro Technique is a time management method developed in the late 1980s by Francesco Cirillo. It breaks work into 25-minute focused intervals, which is called 'pomodori' separated by 5-minute short breaks, with a longer 15- to 30-minute break after every four cycles." },
     /* { img: "images/example-arm.svg", caption: "Click any picture to view it full size." },
      { h: "A gallery" },
      { gallery: [
        { src: "images/example-arm.svg", caption: "First view" },
        { src: "images/example-rope.svg", caption: "Second view" }
      ] },*/
      { h: "Video" },
      { p: "" },
      { youtube: "https://youtu.be/jDgdsxK6qcc?si=zriFPU5m3zhSQqYa", caption: "Video Demonstration" },
     /* { h: "Lists, code and notes" },
      { list: ["Bullet one", "Bullet two"] },
      { code: "import numpy as np\nprint(np.linspace(0, 1, 5))" },
      { note: "Notes stand out from the text around them." } */
    ]
  },
  
  {
    id: "plc-retrofit-stone-polisher",
    type: "project",
    featured: true,
    title: "Replacing a FANUC controller with a Siemens S7-300 PLC on a stone polishing machine",
    date: "2023-01",
    
    summary: "Designed and commissioned the automation retrofit of an industrial stone polishing machine at Abul Khair Group.",
    cover: "images/plc.png",
    tags: ["industrial automation", "Siemens S7-300", "PLC", "retrofit"],
    body: [
      { h: "What I did" },
      { p: "At Abul Khair Group I designed, developed and implemented the automation for a stone polishing machine, replacing its FANUC control system with a Siemens S7-300 PLC." },
      { p: "Alongside the retrofit I trained operators and maintenance staff to troubleshoot the new system, and applied electrical safety standards across the production floor." },
      { h: "Related work in the same role" },
      { list: [
        "Worked with cross-functional teams on an OEE (overall equipment effectiveness) improvement project.",
        "Prepared P&ID drawings for the compressed air and cooling water lines.",
        "Created 3D models, assemblies and detailed drawings for a faucet product."
      ] }
    ]
  },
  {
    id: "sheet-metal-press-mold",
    type: "project",
    title: "Designing a sheet metal press mold and Injection mold",
    date: "2017-03",
    summary: "A press mold designed in SolidWorks and cut from heat-treated D3 tool steel plates using wire EDM and for the Injection mold the guide pin has to be cut in the same way",
    tags: ["SolidWorks", "CAD/CAM", "wire EDM", "manufacturing"],
    cover: "images/mold.JPEG",
    
    body: [
      { p: "We designed the sheet metal mold in SolidWorks, then cut the pre-required holes in the D3 tool steel plates so the WEDM wire could be fed through. After heat treatment, the plates were cut to final shape on the WEDM machine." }
    ]
  },
  {
    id: "wall-jet-bsc-thesis",
    type: "thesis",
    status: "Completed",
    title: "Flow analysis of a laminar wall jet",
    date: "2015-10",
    summary: "My BSc thesis at BUET: a numerical solution for the flow of a wall jet, written in MATLAB.",
    tags: ["fluid mechanics", "MATLAB", "numerical methods", "BUET"],
    cover: "images/laminar.png",
    files: [ { label: "Flow Analysis of Laminar Wall Jet", url: "files/thesis.pdf" } ],
    body: [
      { h: "Background" },
      { p: "A wall jet forms when fluid leaves an orifice and flows along a surface. It shows both boundary-layer and free-jet behaviour, so its velocity distribution, recirculation and heat transfer all matter when the flow is used in practice." },
      { h: "Method" },
      { olist: [
        "Derived the continuity and momentum equations for the flow.",
        "Applied a similarity transformation to reduce them to a third-order ordinary differential equation, the governing equation.",
        "Solved that equation numerically in MATLAB with the fourth-order Runge-Kutta method, adapting the known boundary conditions into initial conditions."
      ] }
    ]
  },
  {
    id: "solar-collector-boiler-feed-water",
    type: "project",
    title: "A solar energy collector for boiler feed water",
    date: "2016-01",
    summary: "An open water reservoir that preheats industrial boiler feed water using solar energy.",
    tags: ["thermal design", "solar energy", "boiler"],
    body: [
      { p: "This project designed an open water reservoir that preheats water using solar energy. After chemical treatment, the preheated water is used as feed water for an industrial boiler." }
    ]
  },
  {
    id: "thermal-pile-ansys",
    type: "project",
    title: "Heat transfer analysis of a thermal pile in ANSYS",
    date: "2015-11",
    summary: "A buried cylindrical pipe analysed two ways, by hand calculation and by ANSYS simulation, then compared.",
    cover: "images/ansis.png",
    tags: ["ANSYS", "heat transfer", "simulation"],
    body: [
      { p: "The report analyses heat transfer from a cylindrical tube placed underground. The theoretical route uses the Nusselt number to find the overall heat transfer coefficient, and from it the heat transferred by the pipe." },
      { p: "An ANSYS 16.2 simulation was then run on the same case, and its result was compared with the theory to check that the analysis holds." }
    ]
  },
  {
    id: "uav-solidworks",
    type: "project",
    title: "Designing a complete working UAV in SolidWorks",
    date: "2014-06",
    summary: "A fixed-wing UAV modelled in SolidWorks, with a main wing and aileron built on the SD7037 airfoil.",
    cover: "images/caddesign.png",
    tags: ["SolidWorks", "UAV", "aerodynamics", "CAD"],
    body: [
      { p: "The main wing and aileron use the SD7037 airfoil profile. The final design has a wing span of 1091 mm and a fuselage length of 1524 mm." }
    ]
  },
  {
    id: "anemometer-adc",
    type: "project",
    title: "An air velocity measuring device",
    date: "2013-06",
    summary: "An anemometer rebuilt around a microcontroller's analogue-to-digital converter, with the reading shown on an LCD.",
    tags: ["microcontroller", "ADC", "sensing", "embedded"],
    body: [
      { p: "A bucket wheel mounted on an aluminium pipe generates a voltage as it spins. We found the relationship between that voltage and air velocity, then used the microcontroller's ADC to read the voltage and show the air velocity on an LCD." }
    ]
  },

  /* ---------------------------------------------------------------
     EXAMPLE DRAFT  -  hidden from the site (draft: true).
     Open it at post.html?id=how-to-add-a-post to see every block type.
     Copy it as a starting point, then delete it when you no longer need it.
  --------------------------------------------------------------- */
  {
    id: "how-to-add-a-post",
    type: "blog",
    draft: true,
    title: "Example post: photos, a video and a download",
    date: "2026-01-01",
    summary: "A template that shows every kind of content block. Copy it to start a new post.",
    tags: ["example"],
    cover: "images/example-arm.svg",
    files: [ { label: "Resume (PDF)", url: "files/Resume_Research.pdf" } ],
    body: [
      { p: "This post is marked <code>draft: true</code>, so it does not appear in the lists. Remove that line to publish a post." },
      { h: "A photo with a caption" },
      { img: "images/example-arm.svg", caption: "Click any picture to view it full size." },
      { h: "A gallery" },
      { gallery: [
        { src: "images/example-arm.svg", caption: "First view" },
        { src: "images/example-rope.svg", caption: "Second view" }
      ] },
      { h: "A YouTube video" },
      { p: "Paste any YouTube link. The video loads only when a visitor clicks play." },
      { youtube: "https://www.youtube.com/watch?v=DGHn2uOAVCE", caption: "Replace this link with your own video." },
      { h: "Lists, code and notes" },
      { list: ["Bullet one", "Bullet two"] },
      { code: "import numpy as np\nprint(np.linspace(0, 1, 5))" },
      { note: "Notes stand out from the text around them." }
    ]
  }

];
