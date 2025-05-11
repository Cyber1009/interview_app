/**
 * Subscription Component
 * Handles:
 * - Payment form
 * - Subscription plan selection
 * - User account activation
 * - Payment processing via Stripe popup
 * - Post-payment redirection
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Check as CheckIcon,
  CreditCard as CreditCardIcon,
  AccountCircle as AccountIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { PaymentService, AuthService } from '../../services';

const Subscription = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSession, setPaymentSession] = useState(null);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      period: 'monthly',
      features: [
        '10 Interviews per month',
        'Basic question templates',
        'Email support'
      ],
      recommended: false
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: 29.99,
      period: 'monthly',
      features: [
        'Unlimited interviews',
        'Advanced question templates',
        'Priority email support',
        'Video recording storage'
      ],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 99.99,
      period: 'monthly',
      features: [
        'Everything in Professional',
        'Custom branding',
        'Dedicated account manager',
        'API access',
        'Advanced analytics'
      ],
      recommended: false
    }
  ];

  const steps = ['Select Plan', 'Payment', 'Confirmation'];

  useEffect(() => {
    // Default to Professional plan
    if (!selectedPlan) {
      setSelectedPlan(plans[1].id);
    }

    // Check if we have a pending token, if not redirect to login
    if (!AuthService.hasPendingAccount() && !AuthService.isAuthenticated()) {
      navigate('/interviewer/login', { replace: true });
    }
    
    // Check if we're returning from a successful payment
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      handlePaymentReturn(sessionId);
    }
  }, [navigate, searchParams]);

  // Handle the return from payment popup
  const handlePaymentReturn = async (sessionId) => {
    if (!sessionId) return;
    
    setCheckingPayment(true);
    setError(null);
    
    try {
      // Verify the payment session status
      const sessionStatus = await PaymentService.verifyPaymentSession(sessionId);
      
      if (sessionStatus.payment_status === 'paid') {
        // Complete the registration
        const token = localStorage.getItem('pendingToken');
        if (!token) {
          throw new Error('No verification token found');
        }
        
        await PaymentService.completeRegistration(sessionId, token);
        
        // Clear pending token as we're fully registered now
        localStorage.removeItem('pendingToken');
        
        // Move to confirmation step
        setActiveStep(2);
      } else {
        setError(`Payment not completed. Status: ${sessionStatus.payment_status}`);
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError(err.message || 'Failed to verify payment status');
    } finally {
      setCheckingPayment(false);
    }
  };

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting payment process for plan:', selectedPlan);
      const plan = plans.find(p => p.id === selectedPlan);
      
      // Initialize payment session with backend
      const paymentResult = await PaymentService.processPayment({
        plan: selectedPlan,
        amount: plan.price
      });
      
      setPaymentSession(paymentResult);
      
      if (!paymentResult.checkoutUrl) {
        throw new Error('No checkout URL received from payment provider');
      }
      
      // Open the Stripe checkout in a popup
      try {
        await PaymentService.openStripeCheckout(paymentResult.checkoutUrl);
        
        // Check payment status when popup is closed
        setCheckingPayment(true);
        try {
          // Wait a moment for Stripe webhook to process the payment
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Verify payment status
          const sessionStatus = await PaymentService.verifyPaymentSession(paymentResult.sessionId);
          
          if (sessionStatus.payment_status === 'paid') {
            // Complete registration
            await PaymentService.completeRegistration(paymentResult.sessionId, paymentResult.token);
            
            // Clear pending token
            localStorage.removeItem('pendingToken');
            
            // Move to confirmation step
            setActiveStep(2);
          } else {
            setError('Payment not completed. Please try again or contact support.');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          setError('Failed to verify payment status. If you completed payment, please contact support.');
        } finally {
          setCheckingPayment(false);
        }
      } catch (popupError) {
        // Popup was blocked
        setPopupBlocked(true);
        console.error('Popup error:', popupError);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };
  
  const openCheckoutManually = () => {
    if (paymentSession?.checkoutUrl) {
      window.open(paymentSession.checkoutUrl, '_blank');
      setPopupBlocked(false);
    }
  };

  const handleComplete = () => {
    // Redirect to the appropriate dashboard based on user role
    const role = AuthService.getUserRole();
    if (role === 'interviewer') {
      navigate('/interviewer', { replace: true });
    } else if (role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      // If no role is determined, redirect to login
      navigate('/interviewer/login', { replace: true });
    }
  };

  const renderPlanSelection = () => (
    <>
      <Typography variant="h5" gutterBottom>
        Choose a Subscription Plan
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Select the plan that best fits your needs
      </Typography>
      
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <RadioGroup
          aria-label="subscription-plan"
          name="subscription-plan"
          value={selectedPlan}
          onChange={handlePlanChange}
        >
          <Grid container spacing={3}>
            {plans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%',
                    border: plan.recommended ? '2px solid' : '1px solid',
                    borderColor: plan.recommended ? 'primary.main' : 'divider',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  {plan.recommended && (
                    <Box 
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        typography: 'caption',
                        fontWeight: 'bold'
                      }}
                    >
                      RECOMMENDED
                    </Box>
                  )}
                  <CardContent sx={{ p: 3 }}>
                    <FormControlLabel 
                      value={plan.id} 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="h6" component="div">
                            {plan.name}
                          </Typography>
                          <Typography variant="h4" component="div" sx={{ my: 2, fontWeight: 700 }}>
                            ${plan.price}
                            <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                              /{plan.period}
                            </Typography>
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ mt: 2 }}>
                            {plan.features.map((feature, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CheckIcon sx={{ mr: 1, color: 'success.main', fontSize: 18 }} />
                                <Typography variant="body2">
                                  {feature}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      }
                      sx={{ 
                        ml: 0, 
                        width: '100%',
                        alignItems: 'flex-start',
                        '.MuiFormControlLabel-label': { width: '100%' }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </>
  );

  const renderPaymentStep = () => (
    <>
      <Typography variant="h5" gutterBottom>
        Payment
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        You'll be redirected to our secure payment provider to complete your subscription
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        p: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        mb: 3
      }}>
        <PaymentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          {plans.find(p => p.id === selectedPlan)?.name}
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          ${plans.find(p => p.id === selectedPlan)?.price}
          <Typography component="span" variant="body1">
            /{plans.find(p => p.id === selectedPlan)?.period}
          </Typography>
        </Typography>
        
        <Alert severity="info" sx={{ mt: 2, width: '100%', maxWidth: 500 }}>
          <Typography variant="body2">
            You'll be redirected to Stripe, our secure payment processor. Your payment information is protected with industry-standard encryption.
          </Typography>
        </Alert>
      </Box>
      
      {checkingPayment && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography>Verifying payment status...</Typography>
        </Box>
      )}
    </>
  );

  const renderConfirmation = () => {
    const selectedPlanDetails = plans.find(p => p.id === selectedPlan);
    
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Box 
          sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: 'success.main', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <CheckIcon sx={{ fontSize: 40 }} />
        </Box>
        
        <Typography variant="h4" gutterBottom color="success.main">
          Payment Successful!
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Thank you for subscribing to our {selectedPlanDetails?.name}
        </Typography>
        
        <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Subscription Details
          </Typography>
          <Grid container spacing={2} sx={{ textAlign: 'left' }}>
            <Grid item xs={6} sx={{ fontWeight: 'bold' }}>Plan:</Grid>
            <Grid item xs={6}>{selectedPlanDetails?.name}</Grid>
            <Grid item xs={6} sx={{ fontWeight: 'bold' }}>Amount:</Grid>
            <Grid item xs={6}>${selectedPlanDetails?.price}/{selectedPlanDetails?.period}</Grid>
            <Grid item xs={6} sx={{ fontWeight: 'bold' }}>Status:</Grid>
            <Grid item xs={6}>Active</Grid>
          </Grid>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          A confirmation email has been sent to your registered email address.
        </Typography>
      </Box>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPlanSelection();
      case 1:
        return renderPaymentStep();
      case 2:
        return renderConfirmation();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0 || activeStep === steps.length - 1 || loading || checkingPayment}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleComplete}
                startIcon={<AccountIcon />}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={activeStep === 0 ? handleNext : handlePayment}
                disabled={loading || checkingPayment}
                startIcon={activeStep === 1 ? <CreditCardIcon /> : null}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : checkingPayment ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Checking Payment...
                  </>
                ) : activeStep === 0 ? 'Next' : 'Proceed to Payment'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Popup blocked dialog */}
      <Dialog open={popupBlocked} onClose={() => setPopupBlocked(false)}>
        <DialogTitle>Popup Blocked</DialogTitle>
        <DialogContent>
          <DialogContentText>
            It appears that your browser blocked the payment popup window. Please click the button below to open the payment page in a new tab.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPopupBlocked(false)}>Cancel</Button>
          <Button variant="contained" onClick={openCheckoutManually}>
            Open Payment Page
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Subscription;