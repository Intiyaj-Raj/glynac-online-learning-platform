import { Course } from "../types";

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-react-fullstack",
    slug: "modern-react-nextjs-architecture",
    title: "Modern Full-Stack React & Next.js: Architecture to Cloud",
    shortDescription:
      "Master modern server components, Suspense, state management patterns, and edge deployments with production best practices.",
    fullDescription:
      "Become an elite full-stack engineer. This deep-dive masterclass takes you from fundamental React 19 reconciliation to Next.js App Router server actions, streaming architectures, and distributed state caching on edge networks. Designed with real-world enterprise codebases in mind.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop",
    category: "Full-Stack Development",
    level: "Intermediate",
    totalDurationSeconds: 14400, // 4 hours
    rating: 4.95,
    reviewsCount: 1420,
    studentsEnrolled: 18450,
    badgeName: "React Architect",
    featured: true,
    instructor: {
      id: "inst-1",
      name: "Dr. Sarah Lin",
      title: "Principal Software Architect & Google Developer Expert",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      bio: 'Ex-Staff Engineer at Vercel and Meta. Author of "Resilient Frontend Systems". 14+ years building high-throughput distributed web applications.',
      rating: 4.98,
      studentsCount: 64000,
      coursesCount: 6,
    },
    tags: [
      "React 19",
      "Next.js",
      "TypeScript",
      "Server Components",
      "Tailwind CSS",
    ],
    prerequisites: [
      "Solid foundation in JavaScript ES6+ (Promises, async/await, closures)",
      "Basic React experience with hooks like useState and useEffect",
      "Familiarity with HTML, CSS, and basic terminal commands",
    ],
    learningOutcomes: [
      "Architect robust Server Components and Streaming SSR with React Suspense",
      "Optimize Web Vitals, dynamic bundling, and edge caching strategies",
      "Design secure Server Actions with Zod mutation boundaries",
      "Implement real-time updates and resilient offline optimistic UI",
    ],
    modules: [
      {
        id: "mod-react-1",
        courseId: "course-react-fullstack",
        title: "Module 1: React Server Components & Streaming Architecture",
        description:
          "Understand the mental shift behind Server Components, Client boundaries, and asynchronous rendering.",
        order: 1,
        lessons: [
          {
            id: "les-r1-1",
            moduleId: "mod-react-1",
            courseId: "course-react-fullstack",
            title:
              "1.1 The Paradigm Shift: Server Components vs Client Boundaries",
            duration: 480, // 8 mins
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            summary:
              "Explore why React introduced Server Components, how hydration works under the hood, and how to eliminate 80% of client bundle size.",
            keyPoints: [
              "Zero-bundle-size dependencies on server",
              'Explicit "use client" directive boundaries',
              "Serialization rules for props passed from server to client",
              "Preventing waterfalls through parallel data streaming",
            ],
            transcript: [
              {
                id: "t-1",
                start: 0,
                end: 12,
                text: "Welcome to glynac e-learn. Today we are demystifying React Server Components.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-2",
                start: 13,
                end: 32,
                text: "Historically, traditional React required shipping all component JavaScript to the browser so the client could build the virtual DOM and hydrate.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-3",
                start: 33,
                end: 55,
                text: "With Server Components, heavy libraries like markdown parsers or date formatters remain 100% on the server, generating lightweight JSON stream payloads.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-4",
                start: 56,
                end: 82,
                text: 'Notice in our code editor how we place the "use client" boundary strictly at the leaf level where interactive state or event listeners are required.',
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-5",
                start: 83,
                end: 115,
                text: "Remember that Server Components can render Client Components, but if a Client Component needs to render a Server Component, you must pass it as children props.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-6",
                start: 116,
                end: 150,
                text: "Let us test what happens during hydration when we inspect the network waterfall tab in Chrome DevTools.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-7",
                start: 151,
                end: 210,
                text: "As you see here, the initial TTFB is ultra-fast because HTML streams progressively, rendering our skeleton loaders instantly.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-8",
                start: 211,
                end: 280,
                text: "Next, we will connect our database query directly inside the async Server Component without needing an extra API route.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-9",
                start: 281,
                end: 360,
                text: "This eliminates round-trips and prevents unintended data exposure to the client browser.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-10",
                start: 361,
                end: 480,
                text: "Make sure to take notes on serialization boundaries. In the next quiz, we will test your understanding of props transfer.",
                speaker: "Dr. Sarah Lin",
              },
            ],
            resources: [
              {
                id: "res-1",
                title: "React Server Components Architecture Diagram (PDF)",
                type: "pdf",
                url: "#",
                size: "2.4 MB",
              },
              {
                id: "res-2",
                title: "Starter GitHub Repository & Branch Links",
                type: "code",
                url: "#",
                size: "Source code",
              },
            ],
          },
          {
            id: "les-r1-2",
            moduleId: "mod-react-1",
            courseId: "course-react-fullstack",
            title: "1.2 Suspense Boundaries & Progressive Streaming UI",
            duration: 540, // 9 mins
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            summary:
              "Learn how to segment slow network operations with Suspense fallbacks without blocking the rest of the application interface.",
            keyPoints: [
              "Granular loading skeletons",
              "Non-blocking async UI chunks",
              "Selective hydration for prioritized user interaction",
            ],
            transcript: [
              {
                id: "t-20",
                start: 0,
                end: 18,
                text: "In lesson two, we tackle Suspense and progressive streaming.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-21",
                start: 19,
                end: 45,
                text: "When your page has multiple independent data dependencies, a slow database query should never block the primary navigation.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-22",
                start: 46,
                end: 85,
                text: "By wrapping slow components in React Suspense with a tailored skeleton fallback, the server flushes the main document structure immediately.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-23",
                start: 86,
                end: 140,
                text: "Once the asynchronous promise resolves, React seamlessly swaps the fallback with the actual DOM elements via script tags.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-24",
                start: 141,
                end: 220,
                text: "Notice how this dramatically boosts Core Web Vitals, especially Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-25",
                start: 221,
                end: 320,
                text: "Let us now simulate a high-latency API endpoint with an artificial 1500ms delay to observe selective hydration.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-26",
                start: 321,
                end: 430,
                text: "Even though the review list is still loading, our search bar and buy buttons are immediately interactive for the visitor.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-27",
                start: 431,
                end: 540,
                text: "That concludes our streaming overview. Ready for the module quiz?",
                speaker: "Dr. Sarah Lin",
              },
            ],
            resources: [
              {
                id: "res-3",
                title: "Suspense Skeletons Cheat Sheet",
                type: "pdf",
                url: "#",
                size: "1.1 MB",
              },
            ],
          },
        ],
        quiz: {
          id: "quiz-react-1",
          courseId: "course-react-fullstack",
          moduleId: "mod-react-1",
          title: "Module 1 Assessment: Server Components & Streaming",
          description:
            "Demonstrate your mastery of React Server Component boundaries, hydration principles, and Suspense workflows.",
          timeLimitSeconds: 240, // 4 mins
          passingScorePercent: 70,
          questions: [
            {
              id: "q-r1",
              type: "multiple-choice",
              question:
                "Which of the following is true about React Server Components (RSC)?",
              options: [
                {
                  id: "opt-a",
                  label:
                    "Their JavaScript code is included in the client bundle downloaded by the browser.",
                },
                {
                  id: "opt-b",
                  label:
                    "They execute strictly on the server and their code dependencies are never sent to the browser.",
                },
                {
                  id: "opt-c",
                  label:
                    "They can use React hooks like useState and useEffect directly.",
                },
                {
                  id: "opt-d",
                  label:
                    "They require client-side JavaScript to render the initial HTML.",
                },
              ],
              correctAnswer: "opt-b",
              explanation:
                "Server Components execute only on the server or during build time. Their code dependencies are completely omitted from the client bundle, reducing download size and hydration cost.",
            },
            {
              id: "q-r2",
              type: "multi-select",
              question:
                'Which features or APIs require adding the "use client" directive in Next.js App Router? (Select all that apply)',
              options: [
                {
                  id: "opt-client-state",
                  label: "Using useState or useReducer for interactive state",
                },
                {
                  id: "opt-event-listener",
                  label:
                    "Attaching browser event listeners like onClick or onChange",
                },
                {
                  id: "opt-db-query",
                  label:
                    "Performing direct database SQL queries or file system reads",
                },
                {
                  id: "opt-browser-api",
                  label:
                    "Accessing browser APIs like window, localStorage, or navigator",
                },
              ],
              correctAnswer: [
                "opt-client-state",
                "opt-event-listener",
                "opt-browser-api",
              ],
              explanation:
                'Database queries and file reads should stay in Server Components. Interactive state (useState), event handlers (onClick), and browser-only globals (window, localStorage) require the "use client" directive.',
            },
            {
              id: "q-r3",
              type: "drag-order",
              question:
                "Arrange the sequence of events during a Next.js Server Component streaming request in chronological order:",
              options: [
                {
                  id: "step-req",
                  label: "1. Browser sends HTTP request for a page",
                },
                {
                  id: "step-stream",
                  label:
                    "2. Server starts rendering and immediately flushes initial HTML shell and Suspense fallbacks",
                },
                {
                  id: "step-promise",
                  label:
                    "3. Long-running async server promises resolve in the background",
                },
                {
                  id: "step-swap",
                  label:
                    "4. Server streams remaining inline chunks and React swaps skeletons with final markup",
                },
              ],
              correctAnswer: [
                "step-req",
                "step-stream",
                "step-promise",
                "step-swap",
              ],
              explanation:
                "First the request hits the server; the shell is streamed immediately to reduce TTFB; background promises finish fetching; and finally the resolved HTML chunks swap out the Suspense fallback skeletons.",
            },
          ],
        },
      },
      {
        id: "mod-react-2",
        courseId: "course-react-fullstack",
        title: "Module 2: Server Actions & Resilient Mutations",
        description:
          "Implement progressive enhancement, secure form mutations, and optimistic state synchronization.",
        order: 2,
        lessons: [
          {
            id: "les-r2-1",
            moduleId: "mod-react-2",
            courseId: "course-react-fullstack",
            title: "2.1 Server Actions & Progressive Enhancement",
            duration: 510,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            summary:
              "Create type-safe backend mutation functions directly invoked from form elements with automatic CSRF defense.",
            keyPoints: [
              'The "use server" boundary inside actions',
              "Zod schema validation on payload",
              "Revalidating cached paths with revalidatePath()",
            ],
            transcript: [
              {
                id: "t-30",
                start: 0,
                end: 20,
                text: "Welcome to Module 2. Today we build mutations without manual fetch handlers.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-31",
                start: 21,
                end: 60,
                text: "Server Actions are asynchronous functions that run securely on the server environment.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-32",
                start: 61,
                end: 120,
                text: "When invoked inside a form action, they support progressive enhancement even if JavaScript has not loaded yet.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-33",
                start: 121,
                end: 240,
                text: "We always validate input with Zod on the server. Never trust client-provided payloads blindly.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-34",
                start: 241,
                end: 380,
                text: "After database updates, revalidatePath clears the Data Cache and sends the updated RSC payload in the same HTTP response.",
                speaker: "Dr. Sarah Lin",
              },
              {
                id: "t-35",
                start: 381,
                end: 510,
                text: "Take a note on how optimistic UI works with useOptimistic in the next lesson.",
                speaker: "Dr. Sarah Lin",
              },
            ],
            resources: [
              {
                id: "res-4",
                title: "Server Action Security Patterns",
                type: "pdf",
                url: "#",
                size: "850 KB",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "course-genai-llm",
    slug: "generative-ai-llm-systems-engineering",
    title: "Generative AI & LLM Systems Engineering: RAG to Agents",
    shortDescription:
      "Build production-ready LLM pipelines with Gemini 2.5, vector embeddings, hybrid semantic search, and autonomous multi-agent tool execution.",
    fullDescription:
      "Step beyond simple prompts. Learn to engineer robust cognitive architectures: chunking strategies, dense & sparse vector retrieval, reranking algorithms, structured JSON schema outputs, and autonomous agents equipped with sandboxed tool execution and human-in-the-loop workflows.",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    category: "AI & Machine Learning",
    level: "Advanced",
    totalDurationSeconds: 16200, // 4.5 hours
    rating: 4.98,
    reviewsCount: 2190,
    studentsEnrolled: 24300,
    badgeName: "AI Systems Architect",
    featured: true,
    instructor: {
      id: "inst-2",
      name: "Marcus Vance",
      title: "Head of AI Research & Former DeepMind Lead",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      bio: "Leading machine learning researcher focusing on agentic reasoning systems, vector indexing, and low-latency inference at scale.",
      rating: 4.97,
      studentsCount: 89000,
      coursesCount: 5,
    },
    tags: [
      "Gemini API",
      "RAG Pipelines",
      "Vector Databases",
      "Function Calling",
      "Autonomous Agents",
    ],
    prerequisites: [
      "Proficiency in TypeScript or Python",
      "Understanding of REST APIs and JSON data exchange",
      "Basic linear algebra concepts (vectors, dot products, cosine similarity)",
    ],
    learningOutcomes: [
      "Design production RAG pipelines with semantic chunking & reciprocal rank fusion (RRF)",
      "Constrain LLM generations with strict JSON Schemas and Function Calling",
      "Implement ReAct (Reasoning + Acting) loop agents with safety guardrails",
      "Evaluate model hallucinations, context window degradation, and token costs",
    ],
    modules: [
      {
        id: "mod-ai-1",
        courseId: "course-genai-llm",
        title:
          "Module 1: Embeddings, Semantic Search & Retrieval Augmented Generation (RAG)",
        description:
          "From raw unstructured documents to high-dimensional embeddings and low-latency vector indexing.",
        order: 1,
        lessons: [
          {
            id: "les-ai-1",
            moduleId: "mod-ai-1",
            courseId: "course-genai-llm",
            title:
              "1.1 Deep Dive: High-Dimensional Embeddings & Chunking Strategies",
            duration: 600,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            summary:
              "Understand text embedding models, mathematical distance metrics (cosine, Euclidean), and the trade-offs of sliding window chunking.",
            keyPoints: [
              "Cosine similarity vs inner product in normalized space",
              "Chunk size vs context dilution trade-off",
              "Metadata enrichment during indexing",
            ],
            transcript: [
              {
                id: "ta-1",
                start: 0,
                end: 15,
                text: "Welcome to Generative AI Systems Engineering on glynac e-learn.",
                speaker: "Marcus Vance",
              },
              {
                id: "ta-2",
                start: 16,
                end: 40,
                text: "When people think of LLMs, they focus on the prompt. But in production, 80% of accuracy relies on retrieval precision.",
                speaker: "Marcus Vance",
              },
              {
                id: "ta-3",
                start: 41,
                end: 75,
                text: "Text embeddings transform strings into 768 or 1536-dimensional floating point vectors representing semantic meaning.",
                speaker: "Marcus Vance",
              },
              {
                id: "ta-4",
                start: 76,
                end: 120,
                text: "If your chunk size is too small, you lose critical context. If it is too large, the specific needle gets lost in the haystack.",
                speaker: "Marcus Vance",
              },
              {
                id: "ta-5",
                start: 121,
                end: 180,
                text: "Semantic chunking inspects sentence similarity jumps to split paragraphs where topical transitions naturally occur.",
                speaker: "Marcus Vance",
              },
              {
                id: "ta-6",
                start: 181,
                end: 270,
                text: "Let us run our vector search benchmark comparing brute force kNN vs Hierarchical Navigable Small World (HNSW) graphs.",
                speaker: "Marcus Vance",
              },
              {
                id: "ta-7",
                start: 271,
                end: 380,
                text: "Notice how HNSW delivers sub-10ms lookup latencies even across five million enterprise documents.",
                speaker: "Marcus Vance",
              },
              {
                id: "ta-8",
                start: 381,
                end: 480,
                text: "We now pass the retrieved top-k context passages into Gemini 2.5 with explicit citation grounding markers.",
                speaker: "Marcus Vance",
              },
              {
                id: "ta-9",
                start: 481,
                end: 600,
                text: "In our upcoming quiz, we will test the pipeline sequence and cosine similarity calculation.",
                speaker: "Marcus Vance",
              },
            ],
            resources: [
              {
                id: "res-ai-1",
                title: "Vector Indexing & Distance Metrics Reference",
                type: "pdf",
                url: "#",
                size: "3.1 MB",
              },
            ],
          },
        ],
        quiz: {
          id: "quiz-ai-1",
          courseId: "course-genai-llm",
          moduleId: "mod-ai-1",
          title: "Module 1 Assessment: RAG Architecture & Vector Indexing",
          description:
            "Evaluate your understanding of semantic retrieval, embedding spaces, and RAG execution flow.",
          timeLimitSeconds: 240,
          passingScorePercent: 70,
          questions: [
            {
              id: "q-ai-1",
              type: "multiple-choice",
              question:
                "Why is Cosine Similarity preferred over Euclidean distance for high-dimensional text embeddings in normalized spaces?",
              options: [
                {
                  id: "opt-cos-1",
                  label:
                    "It measures the angle orientation between vectors, invariant to text length variations",
                },
                {
                  id: "opt-cos-2",
                  label:
                    "It computes strictly on CPU without requiring GPU acceleration",
                },
                {
                  id: "opt-cos-3",
                  label:
                    "It automatically corrects spelling errors in user prompts",
                },
                {
                  id: "opt-cos-4",
                  label: "It compresses the embedding vector down to 8 bits",
                },
              ],
              correctAnswer: "opt-cos-1",
              explanation:
                "Cosine similarity evaluates the cosine of the angle between two multi-dimensional vectors, ensuring that magnitude (length of document) does not falsely distort semantic conceptual closeness.",
            },
            {
              id: "q-ai-2",
              type: "drag-order",
              question:
                "Order the execution steps of a production Retrieval Augmented Generation (RAG) query:",
              options: [
                {
                  id: "rag-1",
                  label: "1. User submits natural language question",
                },
                {
                  id: "rag-2",
                  label:
                    "2. Query is converted to vector embedding via embedding model",
                },
                {
                  id: "rag-3",
                  label:
                    "3. Vector database performs approximate nearest neighbor (ANN) search to retrieve top-k chunks",
                },
                {
                  id: "rag-4",
                  label:
                    "4. Prompt with injected context and system instructions is sent to the LLM for grounded generation",
                },
              ],
              correctAnswer: ["rag-1", "rag-2", "rag-3", "rag-4"],
              explanation:
                "First the user query arrives; it is converted into an embedding; the vector database queries top-k relevant text passages; and finally the LLM synthesizes the answer with grounded context.",
            },
            {
              id: "q-ai-3",
              type: "multi-select",
              question:
                "Which techniques directly reduce hallucination risks in enterprise LLM workflows? (Select all that apply)",
              options: [
                {
                  id: "opt-h-ground",
                  label:
                    "Grounding output with retrieved source document citations",
                },
                {
                  id: "opt-h-temp",
                  label:
                    "Setting lower temperature (e.g. 0.0 to 0.2) for deterministic tasks",
                },
                {
                  id: "opt-h-schema",
                  label:
                    "Enforcing structured JSON Schema constraints on model output",
                },
                {
                  id: "opt-h-max",
                  label:
                    "Setting maximum temperature to 2.0 to maximize creativity",
                },
              ],
              correctAnswer: ["opt-h-ground", "opt-h-temp", "opt-h-schema"],
              explanation:
                "Grounding citations, lower temperature for determinism, and strict JSON schemas all constrain hallucinations. Setting maximum temperature to 2.0 increases randomness and hallucinations.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "course-cloud-k8s",
    slug: "cloud-native-kubernetes-microservices",
    title: "Cloud-Native Kubernetes & Microservices Architecture",
    shortDescription:
      "Design, containerize, orchestrate, and observe high-availability distributed systems on modern cloud platforms.",
    fullDescription:
      "From Linux cgroups and container runtimes to multi-cluster Kubernetes deployments, service mesh traffic management with Istio, zero-downtime canary rollouts, and GitOps pipelines using ArgoCD. Master enterprise resilience.",
    thumbnail:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    category: "Cloud & DevOps",
    level: "Advanced",
    totalDurationSeconds: 18000,
    rating: 4.91,
    reviewsCount: 980,
    studentsEnrolled: 12100,
    badgeName: "Cloud Commander",
    instructor: {
      id: "inst-3",
      name: "Elena Rostova",
      title: "Staff Site Reliability Engineer & CNCF Ambassador",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
      bio: "Leading SRE architect managing clusters handling over 250,000 requests per second. CNCF speaker and open source maintainer.",
      rating: 4.93,
      studentsCount: 42000,
      coursesCount: 4,
    },
    tags: [
      "Kubernetes",
      "Docker",
      "DevOps",
      "Microservices",
      "Helm",
      "Prometheus",
    ],
    prerequisites: [
      "Familiarity with Linux bash commands and networking concepts (DNS, TCP/IP, HTTP)",
      "Basic Docker container experience",
    ],
    learningOutcomes: [
      "Write production-grade Kubernetes manifests with health probes & security contexts",
      "Manage stateful and stateless workloads with automated horizontal pod autoscaling",
      "Configure ingress controllers, TLS termination, and mTLS service mesh routing",
      "Deploy GitOps continuous delivery pipelines with automated rollback verification",
    ],
    modules: [
      {
        id: "mod-k8s-1",
        courseId: "course-cloud-k8s",
        title: "Module 1: Pods, Services, and Networking Anatomy",
        description:
          "Understand the Kubernetes control plane, CNI network fabric, and cluster communication.",
        order: 1,
        lessons: [
          {
            id: "les-k8s-1",
            moduleId: "mod-k8s-1",
            courseId: "course-cloud-k8s",
            title: "1.1 The Lifecycle of a Pod: From API Server to Kubelet",
            duration: 520,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            summary:
              "Trace what occurs when you run kubectl apply: etcd persistence, scheduler filtering, kubelet container creation, and CNI IP allocation.",
            keyPoints: [
              "etcd distributed consensus",
              "Scheduler scoring & filtering algorithms",
              "Kubelet and CRI interaction",
            ],
            transcript: [
              {
                id: "tk-1",
                start: 0,
                end: 20,
                text: "Welcome to Cloud-Native Kubernetes on glynac e-learn.",
                speaker: "Elena Rostova",
              },
              {
                id: "tk-2",
                start: 21,
                end: 60,
                text: "When you type kubectl apply, your manifest hits the kube-apiserver for authentication, authorization, and admission control.",
                speaker: "Elena Rostova",
              },
              {
                id: "tk-3",
                start: 61,
                end: 120,
                text: "The desired state is committed to etcd, our consistent and highly available key-value store.",
                speaker: "Elena Rostova",
              },
              {
                id: "tk-4",
                start: 121,
                end: 200,
                text: "The kube-scheduler detects unscheduled pods and filters nodes based on resource requests, taints, and affinities.",
                speaker: "Elena Rostova",
              },
              {
                id: "tk-5",
                start: 201,
                end: 320,
                text: "Once assigned, the node kubelet talks to the Container Runtime Interface (CRI) such as containerd to pull images and configure cgroups.",
                speaker: "Elena Rostova",
              },
              {
                id: "tk-6",
                start: 321,
                end: 520,
                text: "Finally, the CNI plugin assigns a routable cluster IP address to the pod network namespace.",
                speaker: "Elena Rostova",
              },
            ],
            resources: [
              {
                id: "res-k8s-1",
                title: "Kubernetes Networking Architecture Poster",
                type: "pdf",
                url: "#",
                size: "4.2 MB",
              },
            ],
          },
        ],
        quiz: {
          id: "quiz-k8s-1",
          courseId: "course-cloud-k8s",
          moduleId: "mod-k8s-1",
          title: "Module 1 Assessment: Kubernetes Architecture",
          description:
            "Test your understanding of pod lifecycles, service abstractions, and networking.",
          timeLimitSeconds: 180,
          passingScorePercent: 70,
          questions: [
            {
              id: "q-k1",
              type: "multiple-choice",
              question:
                "Which component is the single source of truth for all cluster state in Kubernetes?",
              options: [
                { id: "opt-k-etcd", label: "etcd distributed key-value store" },
                { id: "opt-k-kubelet", label: "kubelet on each worker node" },
                { id: "opt-k-proxy", label: "kube-proxy iptables rules" },
                { id: "opt-k-cni", label: "CNI network provider" },
              ],
              correctAnswer: "opt-k-etcd",
              explanation:
                "etcd is the consistent and highly-available key-value store used as Kubernetes backing store for all cluster state data.",
            },
            {
              id: "q-k2",
              type: "drag-order",
              question:
                "Arrange the path of an HTTP request entering a Kubernetes cluster from the Internet:",
              options: [
                {
                  id: "p-1",
                  label: "1. External Cloud Load Balancer receives request",
                },
                {
                  id: "p-2",
                  label:
                    "2. Ingress Controller routes traffic based on host and path rules",
                },
                {
                  id: "p-3",
                  label:
                    "3. ClusterIP Service distributes traffic across matching Pod endpoints",
                },
                {
                  id: "p-4",
                  label:
                    "4. Target Container inside application Pod processes request",
                },
              ],
              correctAnswer: ["p-1", "p-2", "p-3", "p-4"],
              explanation:
                "Traffic flows through the external load balancer, enters the Ingress Controller, maps through the ClusterIP Service, and is dispatched to the healthy Pod endpoint.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "course-uiux-design",
    slug: "ui-ux-design-systems-prototyping",
    title: "UI/UX Design Systems & High-Fidelity Prototyping",
    shortDescription:
      "Craft scalable design token architectures, accessible WCAG 2.2 color palettes, and micro-interactions.",
    fullDescription:
      "Bridge the divide between Figma design systems and front-end engineering. Master spatial rhythm, typography hierarchy, token taxonomy, dark mode contrast math, and delightful micro-interactions.",
    thumbnail:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
    category: "UI/UX Design",
    level: "Beginner",
    totalDurationSeconds: 10800,
    rating: 4.88,
    reviewsCount: 1650,
    studentsEnrolled: 15700,
    badgeName: "Design Systems Pioneer",
    instructor: {
      id: "inst-4",
      name: "Chloe Monet",
      title: "Design Director & Design Token Working Group Member",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
      bio: "Design Director who built design systems for Spotify and Airbnb. Passionate about accessibility, typography, and friction-free user journeys.",
      rating: 4.95,
      studentsCount: 38000,
      coursesCount: 3,
    },
    tags: [
      "Design Systems",
      "Figma",
      "UI Design",
      "Accessibility",
      "Typography",
      "Color Theory",
    ],
    prerequisites: [
      "No prior design experience required",
      "Curiosity about user behavior and aesthetic details",
    ],
    learningOutcomes: [
      "Establish a 3-tier design token taxonomy (Global, Semantic, Component)",
      "Ensure WCAG 2.2 AAA accessibility compliance across color contrasts",
      "Design seamless interactive component states (hover, focus-visible, active, disabled)",
      "Handoff pixel-perfect specs to developers with automated token sync",
    ],
    modules: [
      {
        id: "mod-ui-1",
        courseId: "course-uiux-design",
        title: "Module 1: Design Tokens & Visual Hierarchy",
        description:
          "Building foundations: typography scale, spatial grid, and semantic color naming.",
        order: 1,
        lessons: [
          {
            id: "les-ui-1",
            moduleId: "mod-ui-1",
            courseId: "course-uiux-design",
            title:
              "1.1 The Math of Harmony: 8pt Spatial Systems & Modular Scales",
            duration: 420,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
            summary:
              "Learn why the 8-point grid creates visual rhythm and how modular typography ratios (1.25 Major Third, 1.333 Perfect Fourth) guide the reader.",
            keyPoints: [
              "Why 8pt aligns with modern screen subpixel scaling",
              "Modular scale calculators",
              "Eliminating arbitrary pixel values",
            ],
            transcript: [
              {
                id: "tu-1",
                start: 0,
                end: 15,
                text: "Welcome to UI/UX Design Systems on glynac e-learn with Chloe Monet.",
                speaker: "Chloe Monet",
              },
              {
                id: "tu-2",
                start: 16,
                end: 45,
                text: "Great user interfaces feel harmonious not by luck, but through deliberate mathematical rhythm.",
                speaker: "Chloe Monet",
              },
              {
                id: "tu-3",
                start: 46,
                end: 120,
                text: "When every margin, padding, and element height is an exact multiple of 8, cognitive load vanishes.",
                speaker: "Chloe Monet",
              },
              {
                id: "tu-4",
                start: 121,
                end: 240,
                text: "Pairing this with a modular typography scale guarantees readable hierarchy across mobile, tablet, and desktop viewports.",
                speaker: "Chloe Monet",
              },
              {
                id: "tu-5",
                start: 241,
                end: 420,
                text: "In our next quiz, we will test token naming conventions and spatial rules.",
                speaker: "Chloe Monet",
              },
            ],
            resources: [
              {
                id: "res-ui-1",
                title: "8pt Grid & Typography Ratio Template",
                type: "pdf",
                url: "#",
                size: "1.8 MB",
              },
            ],
          },
        ],
        quiz: {
          id: "quiz-ui-1",
          courseId: "course-uiux-design",
          moduleId: "mod-ui-1",
          title: "Module 1 Assessment: Tokens & Spatial Systems",
          description:
            "Assess token naming architectures and accessibility contrast principles.",
          timeLimitSeconds: 180,
          passingScorePercent: 70,
          questions: [
            {
              id: "q-u1",
              type: "multiple-choice",
              question:
                "Which token naming demonstrates proper semantic abstraction according to W3C Design Tokens standards?",
              options: [
                { id: "opt-u-bad", label: "color-blue-500" },
                { id: "opt-u-good", label: "color-action-primary-background" },
                { id: "opt-u-pixel", label: "padding-16px" },
                { id: "opt-u-arbitrary", label: "button-blue-shade" },
              ],
              correctAnswer: "opt-u-good",
              explanation:
                "Semantic tokens (e.g., color-action-primary-background) describe intent and purpose rather than raw values, allowing dark mode or re-theming without breaking code.",
            },
            {
              id: "q-u2",
              type: "multi-select",
              question:
                "What are the minimum WCAG 2.2 AA contrast ratio requirements? (Select all that apply)",
              options: [
                {
                  id: "opt-aa-body",
                  label: "4.5:1 for normal body text against background",
                },
                {
                  id: "opt-aa-large",
                  label: "3:1 for large text (at least 18pt or 14pt bold)",
                },
                {
                  id: "opt-aa-ui",
                  label: "3:1 for UI components and graphical objects",
                },
                { id: "opt-aa-low", label: "1.5:1 for muted helper text" },
              ],
              correctAnswer: ["opt-aa-body", "opt-aa-large", "opt-aa-ui"],
              explanation:
                "WCAG AA mandates 4.5:1 for standard body copy, 3:1 for large text, and 3:1 for UI components/icons. 1.5:1 fails accessibility.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "course-cyber-sec",
    slug: "defensive-cyber-security-zero-trust",
    title: "Defensive Cyber Security & Zero Trust Architecture",
    shortDescription:
      "Defend web applications against modern threat vectors: OWASP Top 10, OAuth vulnerabilities, CSRF, and Zero Trust identity.",
    fullDescription:
      "Think like an attacker to defend like an engineer. Analyze real-world breaches, implement cryptographic signing, sanitize inputs, enforce strict CSP headers, and configure Zero Trust perimeter enforcement.",
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    category: "Security",
    level: "Intermediate",
    totalDurationSeconds: 12600,
    rating: 4.93,
    reviewsCount: 1100,
    studentsEnrolled: 9400,
    badgeName: "Security Sentinel",
    instructor: {
      id: "inst-5",
      name: "Kavita Sundaram",
      title: "Chief Information Security Officer & White-Hat Researcher",
      avatar:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop",
      bio: "CISO and former red team lead. Disclosed critical CVEs in enterprise single-sign-on systems and advisor to national cyber defense panels.",
      rating: 4.96,
      studentsCount: 31000,
      coursesCount: 2,
    },
    tags: [
      "Security",
      "OAuth 2.0",
      "OWASP",
      "Cryptography",
      "Zero Trust",
      "Authentication",
    ],
    prerequisites: [
      "Basic knowledge of HTTP protocols and web cookies",
      "Familiarity with server-side API request cycles",
    ],
    learningOutcomes: [
      "Harden web APIs against OWASP Top 10 injection and deserialization flaws",
      "Implement OAuth 2.1 PKCE authorization code flows correctly",
      "Enforce fine-grained Role-Based and Attribute-Based Access Control (RBAC/ABAC)",
      "Audit dependencies and establish automated software bill of materials (SBOM)",
    ],
    modules: [
      {
        id: "mod-sec-1",
        courseId: "course-cyber-sec",
        title: "Module 1: Modern Identity, OAuth 2.1 & Token Security",
        description:
          "Preventing token theft, CSRF, and session hijacking in single-page applications.",
        order: 1,
        lessons: [
          {
            id: "les-sec-1",
            moduleId: "mod-sec-1",
            courseId: "course-cyber-sec",
            title:
              "1.1 The Anatomy of Secure Authentication: Cookies vs LocalStorage",
            duration: 480,
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            summary:
              "Why storing sensitive JWT access tokens in browser localStorage exposes you to XSS exfiltration, and how HttpOnly SameSite cookies protect users.",
            keyPoints: [
              "XSS token theft vectors in client storage",
              "HttpOnly, Secure, and SameSite=Strict cookie flags",
              "BFF (Backend for Frontend) token exchange pattern",
            ],
            transcript: [
              {
                id: "ts-1",
                start: 0,
                end: 20,
                text: "Welcome to Defensive Cyber Security on glynac e-learn with Kavita Sundaram.",
                speaker: "Kavita Sundaram",
              },
              {
                id: "ts-2",
                start: 21,
                end: 55,
                text: "One of the most frequent vulnerabilities in single-page applications is storing session tokens directly in localStorage.",
                speaker: "Kavita Sundaram",
              },
              {
                id: "ts-3",
                start: 56,
                end: 120,
                text: "If any third-party npm package or unsanitized user comment executes malicious JavaScript, window.localStorage is instantly readable.",
                speaker: "Kavita Sundaram",
              },
              {
                id: "ts-4",
                start: 121,
                end: 240,
                text: "By utilizing HttpOnly, Secure cookies with SameSite attributes, browser scripts are strictly forbidden from accessing the cookie value.",
                speaker: "Kavita Sundaram",
              },
              {
                id: "ts-5",
                start: 241,
                end: 480,
                text: "In our next segment, we will demonstrate the Backend-for-Frontend (BFF) proxy pattern.",
                speaker: "Kavita Sundaram",
              },
            ],
            resources: [
              {
                id: "res-sec-1",
                title: "OWASP Authentication & Session Cheat Sheet",
                type: "pdf",
                url: "#",
                size: "2.1 MB",
              },
            ],
          },
        ],
        quiz: {
          id: "quiz-sec-1",
          courseId: "course-cyber-sec",
          moduleId: "mod-sec-1",
          title: "Module 1 Assessment: Identity & Access Defenses",
          description:
            "Prove your knowledge of secure session storage and authorization flows.",
          timeLimitSeconds: 180,
          passingScorePercent: 70,
          questions: [
            {
              id: "q-s1",
              type: "multiple-choice",
              question:
                "Which cookie flag prevents client-side JavaScript from accessing session tokens via document.cookie?",
              options: [
                { id: "opt-s-httponly", label: "HttpOnly" },
                { id: "opt-s-secure", label: "Secure" },
                { id: "opt-s-samesite", label: "SameSite=Lax" },
                { id: "opt-s-domain", label: "Domain" },
              ],
              correctAnswer: "opt-s-httponly",
              explanation:
                "The HttpOnly flag directs the browser that the cookie must not be accessible via client-side scripts, protecting it from Cross-Site Scripting (XSS) extraction.",
            },
            {
              id: "q-s2",
              type: "multi-select",
              question:
                "Which security headers should be configured on all modern web applications? (Select all that apply)",
              options: [
                {
                  id: "opt-h-csp",
                  label:
                    "Content-Security-Policy (CSP) to restrict script and asset origins",
                },
                {
                  id: "opt-h-xfo",
                  label:
                    "X-Frame-Options: DENY or SAMEORIGIN to prevent clickjacking",
                },
                {
                  id: "opt-h-hsts",
                  label: "Strict-Transport-Security (HSTS) to enforce HTTPS",
                },
                {
                  id: "opt-h-allow",
                  label:
                    "Access-Control-Allow-Origin: * on all authenticated endpoints",
                },
              ],
              correctAnswer: ["opt-h-csp", "opt-h-xfo", "opt-h-hsts"],
              explanation:
                "CSP, X-Frame-Options, and HSTS are essential defense-in-depth headers. Setting wildcard CORS (*) on authenticated endpoints creates severe security holes.",
            },
          ],
        },
      },
    ],
  },
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: "ach-first-step",
    title: "First Step",
    description: "Complete your first video lesson on glynac e-learn",
    icon: "🚀",
    progress: 100,
    unlockedAt: "2026-10-30",
  },
  {
    id: "ach-quiz-master",
    title: "Quiz Master",
    description: "Pass any course module quiz with 100% score",
    icon: "🎯",
    progress: 100,
    unlockedAt: "2026-11-01",
  },
  {
    id: "ach-note-taker",
    title: "Deep Thinker",
    description: "Take 3 timestamped notes while watching lessons",
    icon: "✍️",
    progress: 66,
    unlockedAt: undefined,
  },
  {
    id: "ach-streak-fire",
    title: "Unstoppable Momentum",
    description: "Maintain a 5-day continuous learning streak",
    icon: "🔥",
    progress: 100,
    unlockedAt: "2026-11-03",
  },
  {
    id: "ach-graduate",
    title: "Certified Specialist",
    description: "Complete a full course and earn your verifiable certificate",
    icon: "🎓",
    progress: 80,
    unlockedAt: undefined,
  },
];
