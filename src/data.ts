import type { ICourse, IStudent } from './types'


// export const initialCourses: ICourse[] = [
//   {
//     id: 'c1',
//     title: 'Data Structures and Algorithms',
//     code: 'CS301',
//     description: 'Comprehensive study of fundamental data structures including arrays, linked lists, trees, graphs, and algorithms for sorting, searching, and graph traversal. Students will implement each structure and analyze time/space complexity.',
//     faculty: 'Dr. Rajesh Kumar',
//     facultyId: 'f1',
//     category: 'Computer Science',
//     level: 'intermediate',
//     status: 'approved',
//     approvalStatus: 'approved',
//     units: [
//       {
//         id: 'u1',
//         title: 'Unit 1: Arrays and Linked Lists',
//         content: [
//           { id: 'ct1', title: 'Introduction to Arrays', type: 'pdf', content: 'Arrays are contiguous memory locations that store elements of the same data type. Each element is identified by its index. Arrays offer O(1) random access but O(n) insertion/deletion. Memory layout: base_address + (index × element_size). Multi-dimensional arrays use row-major or column-major ordering.' },
//           { id: 'ct2', title: 'Linked List Implementation', type: 'pdf', content: 'A linked list is a linear data structure where elements are stored in nodes connected via pointers. Types: Singly Linked (next pointer), Doubly Linked (prev + next), Circular. Operations: insert O(1) at head, delete O(1) given node pointer, search O(n). Space overhead: one/two pointer(s) per node.' },
//           { id: 'ct3', title: 'Array vs Linked List Quiz', type: 'quiz', content: 'Test your knowledge of arrays and linked lists. Q1: What is the time complexity of accessing the nth element in a linked list? Q2: When is an array preferred over a linked list? Q3: What is the space complexity of a doubly linked list?' },
//         ]
//       },
//       {
//         id: 'u2',
//         title: 'Unit 2: Stacks and Queues',
//         content: [
//           { id: 'ct4', title: 'Stack Operations and Applications', type: 'pdf', content: 'A stack is a linear data structure following LIFO (Last In First Out) principle. Core operations: push(), pop(), peek(), isEmpty() — all O(1). Applications: function call stack, expression evaluation, backtracking, undo/redo operations, balanced parentheses checking.' },
//           { id: 'ct5', title: 'Queue and Priority Queue', type: 'video', content: 'Queue follows FIFO (First In First Out). Implementations: array-based (circular queue), linked list-based. Deque supports insertion/deletion at both ends. Priority Queue: elements served by priority. Heap-based priority queue supports enqueue/dequeue in O(log n).' },
//         ]
//       },
//       {
//         id: 'u3',
//         title: 'Unit 3: Trees and Graphs',
//         content: [
//           { id: 'ct6', title: 'Binary Search Trees', type: 'pdf', content: 'Binary Search Tree: left subtree contains nodes with keys less than root, right subtree contains nodes with keys greater. Operations: search, insert, delete — average O(log n), worst O(n). Self-balancing variants: AVL Tree (height difference ≤ 1), Red-Black Tree (used in most language standard libraries).' },
//           { id: 'ct7', title: 'Graph Traversal Algorithms', type: 'pdf', content: 'BFS (Breadth-First Search): explores level by level using a queue. Time: O(V+E). Used for shortest path in unweighted graphs. DFS (Depth-First Search): explores as deep as possible using stack/recursion. Time: O(V+E). Used for cycle detection, topological sort, connected components.' },
//         ]
//       }
//     ],
//     syllabus: [
//       { id: 's1', topic: 'Arrays and Strings', hours: 6, description: 'Memory layout, indexing, multi-dimensional arrays, string operations' },
//       { id: 's2', topic: 'Linked Lists', hours: 8, description: 'Singly, doubly, circular linked lists and operations' },
//       { id: 's3', topic: 'Stacks and Queues', hours: 6, description: 'LIFO, FIFO implementations and applications' },
//       { id: 's4', topic: 'Trees and BST', hours: 10, description: 'BST, AVL, Heap, B-trees and traversals' },
//       { id: 's5', topic: 'Graphs', hours: 10, description: 'BFS, DFS, Dijkstra, Kruskal, Prim' },
//       { id: 's6', topic: 'Sorting Algorithms', hours: 8, description: 'Bubble, Selection, Insertion, Merge, Quick, Heap sort' },
//     ],
//     experiments: [
//       { id: 'e1', title: 'Exp 1: Array Rotation', description: 'Implement array rotation using O(n) time and O(1) space using reversal algorithm', materials: 'C compiler, GCC, IDE (Code::Blocks or VS Code)' },
//       { id: 'e2', title: 'Exp 2: Linked List Reversal', description: 'Reverse a singly linked list iteratively and recursively, measure and compare performance', materials: 'C compiler, IDE, Valgrind for memory analysis' },
//       { id: 'e3', title: 'Exp 3: Binary Tree Traversal', description: 'Implement inorder, preorder, postorder traversal iteratively using stack', materials: 'C++ IDE, Graphviz for tree visualization' },
//       { id: 'e4', title: 'Exp 4: Graph BFS/DFS', description: 'Implement BFS and DFS for undirected graph, find connected components', materials: 'Python 3.10+, NetworkX library, Matplotlib' },
//     ],
//     enrolledStudents: ['st1', 'st2', 'st3', 'st4', 'st5'],
//     createdAt: '2024-01-15'
//   },
//   {
//     id: 'c2',
//     title: 'Database Management Systems',
//     code: 'CS302',
//     description: 'Introduction to relational database concepts, SQL query language, normalization theory, indexing strategies, transaction management, and concurrency control protocols used in modern enterprise systems.',
//     faculty: 'Dr. Priya Sharma',
//     facultyId: 'f2',
//     category: 'Computer Science',
//     level: 'intermediate',
//     status: 'approved',
//     approvalStatus: 'approved',
//     units: [
//       {
//         id: 'u4',
//         title: 'Unit 1: ER Model and Relational Model',
//         content: [
//           { id: 'ct8', title: 'Entity Relationship Diagrams', type: 'pdf', content: 'ER diagrams model the logical structure of databases. Entities represent real-world objects. Attributes describe entity properties. Relationships define associations between entities. Cardinalities: one-to-one (1:1), one-to-many (1:N), many-to-many (M:N). Extended ER: specialization, generalization, aggregation.' },
//           { id: 'ct9', title: 'Relational Algebra', type: 'pdf', content: 'Relational algebra is a procedural query language. Operations: Select (σ), Project (π), Union (∪), Difference (−), Cartesian Product (×), Join (⋈). Derived operations: Intersection, Natural Join, Division. These operations form the mathematical foundation for SQL.' },
//         ]
//       },
//       {
//         id: 'u5',
//         title: 'Unit 2: SQL and Optimization',
//         content: [
//           { id: 'ct10', title: 'DDL, DML, and DCL Commands', type: 'pdf', content: 'SQL DDL: CREATE TABLE, ALTER TABLE, DROP TABLE, CREATE INDEX. DML: SELECT, INSERT, UPDATE, DELETE. DCL: GRANT, REVOKE. TCL: COMMIT, ROLLBACK, SAVEPOINT. Aggregate functions: COUNT, SUM, AVG, MAX, MIN. GROUP BY, HAVING, ORDER BY.' },
//           { id: 'ct11', title: 'Joins, Subqueries, and Views', type: 'video', content: 'SQL Joins combine rows from multiple tables: INNER JOIN (intersection), LEFT/RIGHT OUTER JOIN, FULL JOIN, CROSS JOIN, SELF JOIN. Subqueries: correlated vs non-correlated, EXISTS, IN operators. Views: virtual tables for abstraction and security.' },
//         ]
//       }
//     ],
//     syllabus: [
//       { id: 's7', topic: 'Database Design and ER Model', hours: 8, description: 'ER modeling, schema design, mapping to relational model' },
//       { id: 's8', topic: 'SQL', hours: 12, description: 'DDL, DML, DCL, TCL, aggregate functions, joins, subqueries' },
//       { id: 's9', topic: 'Normalization', hours: 6, description: '1NF, 2NF, 3NF, BCNF, 4NF, functional dependencies' },
//       { id: 's10', topic: 'Transactions and Concurrency', hours: 8, description: 'ACID properties, isolation levels, lock-based protocols, deadlock' },
//       { id: 's11', topic: 'Indexing and Query Optimization', hours: 6, description: 'B+ trees, hash indexing, query execution plans' },
//     ],
//     experiments: [
//       { id: 'e5', title: 'Exp 1: ER Diagram Design', description: 'Design ER diagram for a hospital management system with minimum 6 entities', materials: 'MySQL Workbench 8.0 or draw.io' },
//       { id: 'e6', title: 'Exp 2: SQL Queries and Joins', description: 'Write complex SQL queries including multi-table joins, subqueries, and window functions', materials: 'MySQL 8.0, MySQL Workbench' },
//       { id: 'e7', title: 'Exp 3: PL/SQL Procedures', description: 'Create stored procedures, triggers, and cursors for a banking database', materials: 'Oracle 19c or PostgreSQL 14+' },
//     ],
//     enrolledStudents: ['st1', 'st3', 'st5'],
//     createdAt: '2024-01-20'
//   },
//   {
//     id: 'c3',
//     title: 'Machine Learning Fundamentals',
//     code: 'CS401',
//     description: 'Core concepts of machine learning including supervised, unsupervised, and reinforcement learning paradigms with practical Python implementations using scikit-learn, TensorFlow, and Keras.',
//     faculty: 'Dr. Rajesh Kumar',
//     facultyId: 'f1',
//     category: 'Artificial Intelligence',
//     level: 'advanced',
//     status: 'pending',
//     approvalStatus: 'pending',
//     units: [
//       {
//         id: 'u6',
//         title: 'Unit 1: Introduction to Machine Learning',
//         content: [
//           { id: 'ct12', title: 'What is Machine Learning?', type: 'pdf', content: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. Types: Supervised Learning (labeled data), Unsupervised Learning (unlabeled data), Reinforcement Learning (reward-based). Applications: image recognition, NLP, recommendation systems, fraud detection.' },
//           { id: 'ct13', title: 'Python for ML — Environment Setup', type: 'video', content: 'Setting up the Python ML environment: Anaconda distribution, Jupyter Notebooks, key libraries: NumPy (numerical computing), Pandas (data manipulation), Matplotlib/Seaborn (visualization), scikit-learn (ML algorithms), TensorFlow/Keras (deep learning). Virtual environments with conda.' },
//         ]
//       }
//     ],
//     syllabus: [
//       { id: 's12', topic: 'Supervised Learning', hours: 12, description: 'Linear regression, logistic regression, SVM, decision trees, random forests, gradient boosting' },
//       { id: 's13', topic: 'Unsupervised Learning', hours: 8, description: 'K-means, hierarchical clustering, DBSCAN, PCA, autoencoders' },
//       { id: 's14', topic: 'Neural Networks and Deep Learning', hours: 12, description: 'Perceptron, backpropagation, CNNs, RNNs, LSTMs, transformers' },
//       { id: 's15', topic: 'Model Evaluation and Optimization', hours: 8, description: 'Cross-validation, bias-variance tradeoff, regularization, hyperparameter tuning' },
//     ],
//     experiments: [
//       { id: 'e8', title: 'Exp 1: Linear Regression', description: 'Implement linear regression from scratch using NumPy and compare with scikit-learn', materials: 'Python 3.10, NumPy, Matplotlib, Jupyter Notebook' },
//       { id: 'e9', title: 'Exp 2: Image Classification CNN', description: 'Build and train a CNN for MNIST and CIFAR-10 digit/image classification', materials: 'Python, TensorFlow 2.x, Keras, GPU recommended' },
//       { id: 'e10', title: 'Exp 3: NLP Sentiment Analysis', description: 'Build a sentiment analysis model using LSTM on IMDB movie review dataset', materials: 'Python, TensorFlow, NLTK, Pandas' },
//     ],
//     enrolledStudents: ['st2', 'st4'],
//     createdAt: '2024-02-01'
//   },
//   {
//     id: 'c4',
//     title: 'Operating Systems',
//     code: 'CS303',
//     description: 'Fundamental concepts of operating systems including process management, CPU scheduling, memory management techniques, file systems, I/O management, and distributed system basics.',
//     faculty: 'Dr. Anitha Reddy',
//     facultyId: 'f3',
//     category: 'Computer Science',
//     level: 'intermediate',
//     status: 'approved',
//     approvalStatus: 'approved',
//     units: [
//       {
//         id: 'u7',
//         title: 'Unit 1: Processes and CPU Scheduling',
//         content: [
//           { id: 'ct14', title: 'Process Concepts and PCB', type: 'pdf', content: 'A process is a program in execution. Process Control Block (PCB): stores PID, process state, PC, CPU registers, memory limits, I/O status, accounting info. Process states: New → Ready → Running → Waiting → Terminated. Context switching: saving/restoring PCB when switching between processes.' },
//           { id: 'ct15', title: 'CPU Scheduling Algorithms', type: 'pdf', content: 'FCFS: simple, convoy effect, average waiting time high. SJF: optimal average waiting time, starvation possible. SRTF: preemptive SJF. Round Robin: fair, good for time-sharing, context switch overhead. Priority Scheduling: starvation, aging solution. Multilevel Queue: different queues for different process types.' },
//           { id: 'ct16', title: 'Deadlock: Detection and Prevention', type: 'pdf', content: 'Deadlock conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Prevention: deny one condition. Avoidance: Banker\'s Algorithm — safe/unsafe state. Detection: resource allocation graph, cycle detection. Recovery: process termination, resource preemption.' },
//         ]
//       }
//     ],
//     syllabus: [
//       { id: 's16', topic: 'Process Management', hours: 10, description: 'PCB, process states, inter-process communication, synchronization' },
//       { id: 's17', topic: 'CPU Scheduling', hours: 8, description: 'FCFS, SJF, Round Robin, Priority, Multilevel Queue scheduling' },
//       { id: 's18', topic: 'Memory Management', hours: 10, description: 'Paging, segmentation, virtual memory, page replacement algorithms' },
//       { id: 's19', topic: 'File Systems', hours: 8, description: 'FAT32, NTFS, ext4, inode structure, directory implementation' },
//       { id: 's20', topic: 'I/O Systems', hours: 6, description: 'Disk scheduling: FCFS, SSTF, SCAN, C-SCAN algorithms' },
//     ],
//     experiments: [
//       { id: 'e11', title: 'Exp 1: CPU Scheduling Simulation', description: 'Simulate FCFS, SJF, Round Robin scheduling and compute average waiting/turnaround time', materials: 'C/C++, Linux, GCC compiler' },
//       { id: 'e12', title: 'Exp 2: Producer-Consumer Problem', description: 'Implement producer-consumer problem using semaphores and mutex locks', materials: 'C with POSIX threads (pthreads), Linux' },
//       { id: 'e13', title: 'Exp 3: Page Replacement Algorithms', description: 'Implement FIFO, LRU, Optimal page replacement and compare page fault rates', materials: 'Python 3.x or C++' },
//     ],
//     enrolledStudents: ['st1', 'st2', 'st5'],
//     createdAt: '2024-01-25'
//   },
//   {
//     id: 'c5',
//     title: 'Web Development with React',
//     code: 'CS402',
//     description: 'Modern full-stack web development using React 18, Node.js, Express, and MongoDB. Covers component architecture, hooks, state management with Redux, REST APIs, authentication, and cloud deployment.',
//     faculty: 'Dr. Vikram Singh',
//     facultyId: 'f4',
//     category: 'Web Technology',
//     level: 'intermediate',
//     status: 'draft',
//     approvalStatus: 'pending',
//     units: [],
//     syllabus: [
//       { id: 's21', topic: 'HTML5 and CSS3 Fundamentals', hours: 6, description: 'Semantic HTML, CSS3 features, Flexbox, Grid, responsive design' },
//       { id: 's22', topic: 'JavaScript ES2022+', hours: 8, description: 'Arrow functions, destructuring, promises, async/await, modules, classes' },
//       { id: 's23', topic: 'React 18 Core Concepts', hours: 12, description: 'Components, JSX, props, state, hooks, context, lifecycle' },
//       { id: 's24', topic: 'Node.js and Express APIs', hours: 8, description: 'REST API design, middleware, authentication, JWT tokens' },
//       { id: 's25', topic: 'MongoDB and Mongoose', hours: 6, description: 'Document model, schema design, CRUD operations, aggregation' },
//     ],
//     experiments: [
//       { id: 'e14', title: 'Exp 1: Responsive Portfolio', description: 'Build a responsive portfolio website with HTML, CSS Grid, and Flexbox', materials: 'VS Code, Chrome DevTools, GitHub Pages' },
//       { id: 'e15', title: 'Exp 2: React Todo App', description: 'Build a full-featured Todo application with local storage persistence', materials: 'Node.js 18+, npm, VS Code, React DevTools' },
//       { id: 'e16', title: 'Exp 3: Full-Stack Blog API', description: 'Build REST API with Node.js/Express, MongoDB, JWT auth, and React frontend', materials: 'Node.js 18+, MongoDB Atlas, Postman, VS Code' },
//     ],
//     enrolledStudents: [],
//     createdAt: '2024-02-10'
//   },
//   {
//     id: 'c6',
//     title: 'Computer Networks',
//     code: 'CS304',
//     description: 'Study of data communication, network protocols, TCP/IP suite, routing algorithms, network security, and emerging networking technologies including SDN and wireless networks.',
//     faculty: 'Dr. Priya Sharma',
//     facultyId: 'f2',
//     category: 'Computer Science',
//     level: 'intermediate',
//     status: 'approved',
//     approvalStatus: 'approved',
//     units: [
//       {
//         id: 'u8',
//         title: 'Unit 1: Network Fundamentals',
//         content: [
//           { id: 'ct17', title: 'OSI and TCP/IP Models', type: 'pdf', content: 'OSI Model: 7 layers — Physical, Data Link, Network, Transport, Session, Presentation, Application. Each layer has specific responsibilities and communicates with adjacent layers via SAPs. TCP/IP Model: 4 layers — Network Access, Internet, Transport, Application. Protocol encapsulation: data → segment → packet → frame → bits.' },
//         ]
//       }
//     ],
//     syllabus: [
//       { id: 's26', topic: 'Data Communication Fundamentals', hours: 6, description: 'Signals, bandwidth, Nyquist/Shannon theorems, transmission media' },
//       { id: 's27', topic: 'Network Layer', hours: 10, description: 'IP addressing, subnetting, routing protocols: RIP, OSPF, BGP' },
//       { id: 's28', topic: 'Transport Layer', hours: 8, description: 'TCP: connection establishment, flow control, congestion control. UDP' },
//       { id: 's29', topic: 'Application Layer', hours: 8, description: 'HTTP/HTTPS, DNS, DHCP, SMTP, FTP, SSH protocols' },
//       { id: 's30', topic: 'Network Security', hours: 8, description: 'Cryptography, SSL/TLS, firewalls, VPN, intrusion detection' },
//     ],
//     experiments: [
//       { id: 'e17', title: 'Exp 1: Network Packet Analysis', description: 'Capture and analyze network packets using Wireshark for HTTP, TCP, DNS', materials: 'Wireshark, Network access, Linux/Windows' },
//       { id: 'e18', title: 'Exp 2: Socket Programming', description: 'Implement TCP and UDP client-server applications using Python sockets', materials: 'Python 3.x, Linux, two networked machines' },
//     ],
//     enrolledStudents: ['st3', 'st4'],
//     createdAt: '2024-01-30'
//   }
// ]

export const initialStudents: IStudent[] = [
  {
    id: 'st1',
    name: 'Arjun Menon',
    email: 'arjun.menon@campizo.edu',
    studentId: 'CSE2021001',
    enrolledCourses: [
      { courseId: 'c1', progress: 65, status: 'in-progress', currentUnit: 'Unit 2: Stacks and Queues', enrolledAt: '2024-01-20' },
      { courseId: 'c2', progress: 100, status: 'completed', currentUnit: 'Unit 2: SQL and Optimization', enrolledAt: '2024-01-22', completedAt: '2024-03-15' },
      { courseId: 'c4', progress: 30, status: 'in-progress', currentUnit: 'Unit 1: Processes and CPU Scheduling', enrolledAt: '2024-02-01' },
    ]
  },
  {
    id: 'st2',
    name: 'Sneha Patel',
    email: 'sneha.patel@campizo.edu',
    studentId: 'CSE2021002',
    enrolledCourses: [
      { courseId: 'c1', progress: 100, status: 'completed', currentUnit: 'Unit 3: Trees and Graphs', enrolledAt: '2024-01-20', completedAt: '2024-04-01' },
      { courseId: 'c3', progress: 0, status: 'not-started', currentUnit: '', enrolledAt: '2024-02-05' },
      { courseId: 'c4', progress: 75, status: 'in-progress', currentUnit: 'Unit 1: Processes and CPU Scheduling', enrolledAt: '2024-02-01' },
    ]
  },
  {
    id: 'st3',
    name: 'Rahul Joshi',
    email: 'rahul.joshi@campizo.edu',
    studentId: 'CSE2021003',
    enrolledCourses: [
      { courseId: 'c1', progress: 45, status: 'in-progress', currentUnit: 'Unit 1: Arrays and Linked Lists', enrolledAt: '2024-01-25' },
      { courseId: 'c2', progress: 0, status: 'not-started', currentUnit: '', enrolledAt: '2024-01-26' },
      { courseId: 'c6', progress: 55, status: 'in-progress', currentUnit: 'Unit 1: Network Fundamentals', enrolledAt: '2024-02-03' },
    ]
  },
  {
    id: 'st4',
    name: 'Kavya Nair',
    email: 'kavya.nair@campizo.edu',
    studentId: 'CSE2021004',
    enrolledCourses: [
      { courseId: 'c1', progress: 100, status: 'completed', currentUnit: 'Unit 3: Trees and Graphs', enrolledAt: '2024-01-18', completedAt: '2024-03-20' },
      { courseId: 'c3', progress: 20, status: 'in-progress', currentUnit: 'Unit 1: Introduction to Machine Learning', enrolledAt: '2024-02-05' },
      { courseId: 'c6', progress: 0, status: 'not-started', currentUnit: '', enrolledAt: '2024-02-15' },
    ]
  },
  {
    id: 'st5',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@campizo.edu',
    studentId: 'CSE2021005',
    enrolledCourses: [
      { courseId: 'c1', progress: 0, status: 'not-started', currentUnit: '', enrolledAt: '2024-02-10' },
      { courseId: 'c2', progress: 55, status: 'in-progress', currentUnit: 'Unit 2: SQL and Optimization', enrolledAt: '2024-01-28' },
      { courseId: 'c4', progress: 0, status: 'not-started', currentUnit: '', enrolledAt: '2024-02-15' },
    ]
  },
  {
    id: 'st6',
    name: 'Divya Krishnan',
    email: 'divya.krishnan@campizo.edu',
    studentId: 'CSE2021006',
    enrolledCourses: []
  },
  {
    id: 'st7',
    name: 'Aditya Sharma',
    email: 'aditya.sharma@campizo.edu',
    studentId: 'CSE2022001',
    enrolledCourses: []
  },
  {
    id: 'st8',
    name: 'Priya Iyer',
    email: 'priya.iyer@campizo.edu',
    studentId: 'CSE2022002',
    enrolledCourses: []
  },
]
