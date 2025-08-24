import CheckoutTracker from "@/components/checkoutTracker";
import { sdk } from "@/lib/sdk";
import Link from 'next/link'
import { useState, useEffect, useRef } from "react";

export default function KontaktneUdaje() {
    const formRef = useRef();
    const isRequired = ["email", "first_name", "last_name", "address_1", "city", "postal_code", "phone"];
    const [errors, setErrors] = useState({})
    const [shippingaddress, setShippingaddress] = useState({
        "email": "",
        "first_name": "",
        "last_name": "",
        "company": "",
        "address_1": "",
        "address_2": "",
        "city": "",
        "province": "",
        "postal_code": "",
        "country_code": "sk",
        "phone": ""
    })

    useEffect(() => {
        const keys = Object.keys(shippingaddress);
        const restored = {};

        keys.forEach((key) => {
            const val = localStorage.getItem(key);
            if (val) restored[key] = val;
        });

        setShippingaddress((prev) => ({
            ...prev,
            ...restored,
        }));
        }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        localStorage.setItem(name, value)
        setShippingaddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputToBackend = async (shippingaddress) => {
        const cartId = localStorage.getItem("cart_id");
        const { email, ...addressFields } = shippingaddress;
        await sdk.store.cart.update(cartId,{
            email,
            shipping_address: addressFields,
            billing_address: addressFields,
        });
    };


    const checkRequiredFields = () => {
    let newErrors = {};
    for (const el of formRef.current.elements) {
        if (isRequired.includes(el.name)) {
            newErrors[el.name] = el.value.trim() === "";
            }
            }

        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
        };
 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = checkRequiredFields();

        if (!isValid) {
            return;
        }

        await handleInputToBackend(shippingaddress);
        window.location.href = "/doprava-a-platba"; 
    };


  return (
    <div className="bg-white min-h-screen px-4 py-10 sm:px-6 lg:px-20">
      <CheckoutTracker />
      <div className="max-w-4xl mx-auto mt-12">
        <h1 className="text-2xl font-semibold text-black mb-6">Kontaktné údaje</h1>
        <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Email */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-black">Email*</label>
            <input
              type="email"
              name="email"
              value={shippingaddress.email}
              onChange={handleInputChange}
              className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && (
                <p className="text-red-500 text-sm mt-1">Toto pole je povinné</p>)}
          </div>

          {/* First & Last Name */}
          <div>
            <label className="block text-sm font-medium text-black">Meno*</label>
            <input
              type="text"
              name="first_name"
              value={shippingaddress.first_name}            
              onChange={handleInputChange}             
              className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}/>
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">Toto pole je povinné</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Priezvisko*</label>
            <input
              type="text"
              name="last_name"
              value={shippingaddress.last_name}              
              onChange={handleInputChange}              
              className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}/>
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">Toto pole je povinné</p>)}           
          </div>

          {/* Company */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-black">Spoločnosť (voliteľné)</label>
            <input
              type="text"
              name="company"
              value={shippingaddress.company}              
              onChange={handleInputChange}
              className={`mt-1 w-full px-4 py-2 border border-gray-300 rounded-md`}/>
          </div>

          {/* address */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-black">Adresa(Ulica a číslo)*</label>
            <input
              type="text"
              name="address_1"              
              className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.address_1 ? 'border-red-500' : 'border-gray-300'}`}             
              value={shippingaddress.address_1}              
              onChange={handleInputChange}                          
            />
            {errors.address_1 && (
                <p className="text-red-500 text-sm mt-1">Toto pole je povinné</p>)}
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-black">Byt, apartmán, podlažie (voliteľné)</label>
            <input
              type="text"
              name="address_2"
              value={shippingaddress.address_2}              
              onChange={handleInputChange}         
              className={`mt-1 w-full px-4 py-2 border border-gray-300 rounded-md`}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-black">Mesto*</label>
            <input
              type="text"
              name="city"
              value={shippingaddress.city}              
              onChange={handleInputChange}             
              className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}/>
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">Toto pole je povinné</p>)}
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-black">Kraj (voliteľné)</label>
            <input
              type="text"
              name="province"
              value={shippingaddress.province}              
              onChange={handleInputChange}        
              className={`mt-1 w-full px-4 py-2 border border-gray-300 rounded-md`}
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-black">PSČ*</label>
            <input
              type="text"
              name="postal_code"
              value={shippingaddress.postal_code}              
              onChange={handleInputChange}                     
              className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.postal_code ? 'border-red-500' : 'border-gray-300'}`}/>
              {errors.postal_code && (
                <p className="text-red-500 text-sm mt-1">Toto pole je povinné</p>)}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-black">Telefón*</label>
            <input
              type="tel"
              name="phone"
              value={shippingaddress.phone}              
              onChange={handleInputChange}                   
              className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}/>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">Toto pole je povinné</p>)}
          </div>

            {/* Submit Buttons Aligned Left and Right */}
            <div className="col-span-full mt-8 flex justify-between">
                <Link href="/kosik">
                <button
                    type="button"
                    className="px-6 py-3 underline underline-offset-3 cursor-pointer text-black font-medium text-nowrap"
                >
                    Krok naspäť
                </button>
                </Link>

                <button
                type="submit"
                className="px-6 py-3 bg-black text-white hover:text-black hover:bg-white border transition rounded-xl font-medium cursor-pointer"
                >
                Pokračovať v objednávke
                </button>
            </div>

        </form>
      </div>
    </div>
  );
}
