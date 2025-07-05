const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/durga-salon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testAppointment = async () => {
  try {
    console.log('Testing appointment creation...');
    
    const testData = {
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      customerPhone: '9876543210',
      service: 'haircut',
      appointmentDate: new Date('2024-01-15'),
      appointmentTime: '10:00 AM',
      stylist: 'priya',
      notes: 'Test appointment'
    };
    
    console.log('Test data:', testData);
    
    const appointment = new Appointment(testData);
    
    console.log('Appointment object created');
    console.log('Appointment before save:', appointment);
    
    await appointment.save();
    
    console.log('Appointment saved successfully!');
    console.log('Saved appointment:', appointment);
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:');
      Object.values(error.errors).forEach(err => {
        console.error(`- ${err.path}: ${err.message} (value: ${err.value})`);
      });
    }
  } finally {
    mongoose.connection.close();
  }
};

testAppointment(); 