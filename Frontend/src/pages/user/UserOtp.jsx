import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const UserOtp = () => {
  const inputRefs = useRef([]);
  const { email } = useParams();
  const navigate = useNavigate();
  const submitRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map(input => input.value).join('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/otp-verification', { otp, email });
      console.log(response.data);
      navigate('/login');
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error response:', error);
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.error}`);
        alert(error.response.data.message);
      } else {
        console.error('Error message:', error.message);
        alert('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!/^[0-9]{1}$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && !e.metaKey) {
        e.preventDefault();
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const index = inputRefs.current.indexOf(e.target);
        if (index > 0) {
          inputRefs.current[index - 1].value = '';
          inputRefs.current[index - 1].focus();
        }
      }
    };

    const handleInput = (e) => {
      const { target } = e;
      const index = inputRefs.current.indexOf(target);
      if (target.value) {
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        } else {
          submitRef.current.focus();
        }
      }
    };

    const handleFocus = (e) => {
      e.target.select();
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text');
      if (!new RegExp(`^[0-9]{${inputRefs.current.length}}$`).test(text)) {
        return;
      }
      const digits = text.split('');
      inputRefs.current.forEach((input, index) => (input.value = digits[index]));
      submitRef.current.focus();
    };

    inputRefs.current.forEach((input) => {
      if (input) {
        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', handleKeyDown);
        input.addEventListener('focus', handleFocus);
        input.addEventListener('paste', handlePaste);
      }
    });

    return () => {
      inputRefs.current.forEach((input) => {
        if (input) {
          input.removeEventListener('input', handleInput);
          input.removeEventListener('keydown', handleKeyDown);
          input.removeEventListener('focus', handleFocus);
          input.removeEventListener('paste', handlePaste);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 4-digit verification code that was sent to your phone number.
          </p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            {[...Array(4)].map((_, index) => (
              <input
                key={index}
                type="text"
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-[#8e8852] focus:ring-2 focus:ring-[#a39f7436]"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-[#A39F74] px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-[#8e8852] focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
              ref={submitRef}
            >
              Verify Account
            </button>
          </div>
        </form>
        <div className="text-sm text-slate-500 mt-4">
          Didn't receive code?{' '}
          <a className="font-medium text-[#A39F74] hover:text-[#8e8852]" href="#0">
            Resend
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserOtp;
