# MedLedger NG - Electronic Health Records Platform for Nigeria

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/emmanueladewunmi0102-gmailcoms-projects/v0-medledger-ng-clone)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

## 🏥 Vision & Mission

### Vision
To revolutionize healthcare delivery in Nigeria by providing an accessible, comprehensive, and AI-powered Electronic Health Records (EHR) platform that empowers healthcare providers to deliver exceptional patient care while maintaining the highest standards of data security and compliance.

### Mission
MedLedger NG aims to bridge the digital healthcare gap in Nigeria by:
- **Democratizing Healthcare Technology**: Making advanced EHR systems accessible to clinics of all sizes
- **Improving Patient Outcomes**: Enabling better clinical decision-making through comprehensive patient data management
- **Enhancing Healthcare Efficiency**: Streamlining administrative tasks and clinical workflows
- **Supporting Healthcare Providers**: Offering AI-powered assistance for documentation and clinical insights
- **Ensuring Data Security**: Maintaining the highest standards of patient data protection and privacy

## 🚀 About MedLedger NG

MedLedger NG is a modern, mobile-responsive Electronic Health Records platform specifically designed for the Nigerian healthcare ecosystem. Built with cutting-edge technologies, it provides healthcare providers with comprehensive tools to manage patient records, appointments, visits, and clinical documentation efficiently.

### Key Features

#### 📱 **Mobile-First Design**
- Fully responsive interface optimized for smartphones and tablets
- Touch-friendly navigation and controls
- Offline-capable functionality for areas with limited connectivity

#### 🤖 **AI-Powered Clinical Assistant**
- Automated SOAP note generation
- Intelligent prescription suggestions
- Clinical decision support
- Voice-to-text documentation

#### 🔒 **Enterprise-Grade Security**
- End-to-end encryption for all patient data
- Role-based access control (RBAC)
- HIPAA-compliant data handling
- Audit trails for all system activities

#### 📊 **Comprehensive Patient Management**
- Complete patient profiles with medical history
- Vital signs tracking and trending
- Medication management and interaction checking
- Appointment scheduling and reminders

#### 📈 **Advanced Analytics & Reporting**
- Clinical performance metrics
- Patient outcome tracking
- Financial reporting and billing integration
- Custom report generation

## 🛠 Technology Stack

### Current Architecture
- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Vercel AI SDK
- **Deployment**: Vercel Platform

### Future Architecture (Roadmap)
- **Backend**: Migration to standalone Next.js backend with Express.js
- **Database**: Direct PostgreSQL integration
- **Microservices**: Modular service architecture
- **API**: RESTful and GraphQL APIs
- **Real-time**: WebSocket integration for live updates

## 🏗 Project Structure

\`\`\`
medledger-ng/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/               # Login page
│   │   ├── signup/              # Registration page
│   │   ├── callback/            # Auth callback handler
│   │   ├── confirm/             # Email confirmation
│   │   └── confirmed/           # Confirmation success
│   ├── dashboard/               # Main dashboard
│   ├── patients/                # Patient management
│   │   ├── new/                # New patient registration
│   │   └── [id]/               # Patient details
│   ├── appointments/            # Appointment system
│   │   ├── new/                # Schedule appointment
│   │   └── [id]/               # Appointment details
│   ├── visits/                  # Visit management
│   │   ├── new/                # Record new visit
│   │   └── [id]/               # Visit details
│   ├── ai-assistant/            # AI-powered tools
│   ├── reports/                 # Analytics & reporting
│   ├── settings/                # User preferences
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── patients/                # Patient management UI
│   ├── appointments/            # Appointment UI
│   ├── visits/                  # Visit management UI
│   ├── ai-assistant/            # AI assistant UI
│   ├── reports/                 # Reporting components
│   └── settings/                # Settings UI
├── lib/                         # Utility libraries
│   ├── supabase/               # Database client
│   ├── ai.ts                   # AI integration
│   ├── types.ts                # TypeScript definitions
│   └── utils.ts                # Helper functions
├── scripts/                     # Database scripts
│   ├── 01-setup-database.sql   # Initial schema
│   ├── 02-setup-rls-policies.sql # Security policies
│   ├── 03-setup-functions-triggers.sql # Database functions
│   └── 04-seed-templates.sql   # Sample data
└── public/                      # Static assets
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/adenueltech/emrsystem.git
   cd emrsystem
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Configure the following variables:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL scripts in order:
     \`\`\`sql
     -- Execute in Supabase SQL Editor
     scripts/01-setup-database.sql
     scripts/02-setup-rls-policies.sql
     scripts/03-setup-functions-triggers.sql
     scripts/04-seed-templates.sql
     \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Features Overview

### 👥 Patient Management
- **Patient Registration**: Comprehensive patient onboarding with demographics
- **Medical History**: Complete medical history tracking
- **Contact Management**: Emergency contacts and next of kin
- **Insurance Integration**: Insurance provider and policy management

### 📅 Appointment System
- **Smart Scheduling**: Intelligent appointment booking with conflict detection
- **Automated Reminders**: SMS and email appointment reminders
- **Waitlist Management**: Automatic patient notification for cancellations
- **Multi-provider Support**: Support for multiple healthcare providers

### 🏥 Visit Management
- **SOAP Documentation**: Structured clinical documentation
- **Vital Signs Tracking**: Comprehensive vital signs with trending
- **Diagnosis Management**: ICD-10 compliant diagnosis coding
- **Treatment Plans**: Detailed treatment and follow-up planning

### 🤖 AI Assistant
- **Voice-to-Text**: Convert speech to clinical notes
- **Smart Suggestions**: AI-powered clinical recommendations
- **Drug Interactions**: Automatic medication interaction checking
- **Clinical Guidelines**: Evidence-based treatment suggestions

### 📊 Reports & Analytics
- **Patient Analytics**: Comprehensive patient outcome tracking
- **Financial Reports**: Revenue and billing analytics
- **Clinical Metrics**: Quality indicators and performance metrics
- **Custom Dashboards**: Personalized reporting dashboards

### ⚙️ Settings & Configuration
- **User Management**: Role-based access control
- **Clinic Settings**: Customizable clinic preferences
- **Security Settings**: Two-factor authentication and security policies
- **Integration Settings**: Third-party service configurations

## 🔐 Security & Compliance

### Data Protection
- **Encryption**: AES-256 encryption for data at rest and in transit
- **Access Control**: Role-based permissions and audit logging
- **Backup & Recovery**: Automated daily backups with point-in-time recovery
- **Compliance**: HIPAA-compliant data handling procedures

### Privacy Features
- **Data Anonymization**: Patient data anonymization for analytics
- **Consent Management**: Granular patient consent tracking
- **Right to Erasure**: Complete patient data deletion capabilities
- **Data Portability**: Export patient data in standard formats

## 🌍 Nigerian Healthcare Context

### Localization Features
- **Nigerian Demographics**: Support for Nigerian states, LGAs, and ethnic groups
- **Local Currencies**: Naira (₦) pricing and billing
- **Insurance Providers**: Integration with Nigerian health insurance schemes
- **Regulatory Compliance**: Adherence to Nigerian healthcare regulations

### Connectivity Optimization
- **Offline Mode**: Core functionality available without internet
- **Low Bandwidth**: Optimized for slow internet connections
- **Progressive Web App**: Installable on mobile devices
- **Data Compression**: Minimized data usage for cost-effective operation

## 🚧 Roadmap

### Phase 1: Foundation (Current)
- ✅ Core EHR functionality
- ✅ Patient and appointment management
- ✅ Basic reporting
- ✅ Mobile-responsive design

### Phase 2: Enhancement (Q2 2024)
- 🔄 Advanced AI features
- 🔄 Telemedicine integration
- 🔄 Laboratory integration
- 🔄 Pharmacy management

### Phase 3: Scale (Q3 2024)
- 📋 Multi-clinic support
- 📋 Advanced analytics
- 📋 API marketplace
- 📋 Third-party integrations

### Phase 4: Innovation (Q4 2024)
- 📋 Blockchain integration
- 📋 IoT device connectivity
- 📋 Predictive analytics
- 📋 Machine learning insights

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Testing**: Jest and React Testing Library

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

### Technical Support
- **Email**: support@medledger.ng
- **Documentation**: [docs.medledger.ng](https://docs.medledger.ng)
- **Community**: [Discord Server](https://discord.gg/medledger)

### Business Inquiries
- **Email**: business@medledger.ng
- **Phone**: +234 (0) 123 456 7890
- **Address**: Lagos, Nigeria

## 🙏 Acknowledgments

- **Healthcare Professionals**: For their invaluable feedback and requirements
- **Open Source Community**: For the amazing tools and libraries
- **Nigerian Healthcare System**: For inspiring this solution
- **Beta Testers**: For their patience and detailed feedback

---

**MedLedger NG** - Transforming Healthcare, One Record at a Time 🏥💚

*Built with ❤️ for Nigerian Healthcare*
