import { useData } from "./BookingWizard/hooks/useData";
import { useBooking } from "./BookingWizard/hooks/useBooking";
import { SelectService } from "./BookingWizard/steps/SelectService";
import { SelectBarber } from "./BookingWizard/steps/SelectBarber";
import { SelectDate } from "./BookingWizard/steps/SelectDate";
import { Checkout } from "./BookingWizard/steps/Checkout";
import { Success } from "./BookingWizard/steps/Success";
import { useAvailability } from "./BookingWizard/hooks/useAvailability";

const STEP_NUMBERS = { service: 1, barber: 2, date: 3, payment: 4, success: 5 };
const TOTAL_STEPS = 4;

export default function BookingWizard() {
  const { data: services, loading: servicesLoading, error: servicesError } = useData("/services");
  const { data: barbers, loading: barbersLoading, error: barbersError } = useData("/barbers");

  const booking = useBooking();
  const { availableSlots, slotsLoading, slotsError } = useAvailability(
    booking.selectedBarber,
    booking.selectedDate,
  );

  const currentStepNum = STEP_NUMBERS[booking.step] || 1;

  return (
    <div id="booking-wizard" className="w-full">
      {booking.step !== "success" && (
        <div className="flex items-center justify-between mb-6 px-1">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center grow last:grow-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStepNum >= s
                    ? "bg-accent text-surface border-accent shadow-md shadow-accent/10"
                    : "bg-surface text-secondary border-surface border"
                }`}
              >
                {s}
              </div>
              {s < TOTAL_STEPS && (
                <div
                  className={`h-0.5 grow mx-2 rounded-full transition-colors ${
                    currentStepNum > s ? "bg-accent" : "bg-surface"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {booking.error && (
        <div className="mb-4 p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold">
          ⚠️ {booking.error}
        </div>
      )}

      {booking.step === "service" && (
        <SelectService
          services={services}
          servicesLoading={servicesLoading}
          servicesError={servicesError}
          selectedService={booking.selectedService}
          onSelect={(s) => {
            booking.setSelectedService(s);
            booking.highlightAndScroll();
          }}
          onNext={booking.nextStep}
        />
      )}

      {booking.step === "barber" && (
        <SelectBarber
          barbers={barbers}
          barbersLoading={barbersLoading}
          barbersError={barbersError}
          selectedBarber={booking.selectedBarber}
          onSelect={booking.setSelectedBarber}
          onPrev={booking.prevStep}
          onNext={booking.nextStep}
        />
      )}

      {booking.step === "date" && (
        <SelectDate
          selectedDate={booking.selectedDate}
          selectedSlot={booking.selectedSlot}
          availableSlots={availableSlots}
          slotsLoading={slotsLoading}
          onSelectDate={booking.setSelectedDate}
          onSelectSlot={booking.setSelectedSlot}
          onPrev={booking.prevStep}
          onNext={booking.nextStep}
        />
      )}

      {booking.step === "payment" && (
        <Checkout
          selectedService={booking.selectedService}
          selectedBarber={booking.selectedBarber}
          selectedDate={booking.selectedDate}
          selectedSlot={booking.selectedSlot}
          paymentMethod={booking.paymentMethod}
          PAYMENT_METHOD={booking.PAYMENT_METHOD}
          clientName={booking.clientName}
          clientPhone={booking.clientPhone}
          clientEmail={booking.clientEmail}
          onClientNameChange={booking.setClientName}
          onClientPhoneChange={booking.setClientPhone}
          onClientEmailChange={booking.setClientEmail}
          onPaymentMethodChange={booking.setPaymentMethod}
          onSubmit={booking.handleSubmit}
          onPrev={booking.prevStep}
          loading={booking.loading}
          error={booking.error}
          showOnlineModal={booking.showOnlineModal}
          onCloseOnlineModal={booking.handleCloseOnlineModal}
        />
      )}

      {booking.step === "success" && (
        <Success
          appointment={booking.appointment}
          selectedDate={booking.selectedDate}
          selectedSlot={booking.selectedSlot}
          paymentMethod={booking.paymentMethod}
        />
      )}
    </div>
  );
}
