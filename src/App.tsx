import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { WorkspaceLayout } from './components/layout/WorkspaceLayout';

// Public & Marketing Pages
import { LandingPage } from './components/landing/LandingPage';
import { FeaturesPage } from './components/pages/FeaturesPage';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { PricingPage } from './components/pages/PricingPage';
import { AboutPage } from './components/pages/AboutPage';

// Authentication Pages
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';

// SaaS Protected Workspace Pages
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ProposalGeneratorPage } from './components/generator/ProposalGeneratorPage';
import { ProposalEditorPage } from './components/editor/ProposalEditorPage';
import { ProposalHistoryPage } from './components/history/ProposalHistoryPage';
import { PricingCalculatorPage } from './components/calculator/PricingCalculatorPage';
import { ClientCrmPage } from './components/crm/ClientCrmPage';
import { AiToolsPage } from './components/tools/AiToolsPage';
import { SettingsPage } from './components/settings/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* SaaS Protected Workspace Routes */}
            <Route element={<WorkspaceLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/generator" element={<ProposalGeneratorPage />} />
              <Route path="/editor" element={<ProposalEditorPage />} />
              <Route path="/editor/:id" element={<ProposalEditorPage />} />
              <Route path="/history" element={<ProposalHistoryPage />} />
              <Route path="/calculator" element={<PricingCalculatorPage />} />
              <Route path="/crm" element={<ClientCrmPage />} />
              <Route path="/tools" element={<AiToolsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
          <AuthModal />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
