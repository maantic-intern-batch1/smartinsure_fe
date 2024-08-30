import React from 'react';
import { useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '../lottie/homePageAnimation.json';
import Hero from "../components/Hero"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

function HomePage() {
	const userState = useSelector(state => state.user)
	const navigate = useNavigate()
	const homePagePara1 = "Tired of claim headaches? Smart-Insure uses advanced AI to quickly assess your medical claims. Our intelligent system speeds up the process, giving you peace of mind. Let us handle the paperwork while you focus on recovery. "
	const homePagePara2 = "Experience the future of claims – accurate, efficient, and hassle-free. Smart-Insure: Your partner in healthcare."
	const faqs = [
		{
			question: "How does Smart-Insure work?",
			answer: "Smart-Insure uses advanced AI to quickly assess your medical claims. Simply upload your required documents, and our system will provide insights to our expert assessors, speeding up the claims process.",
		},
		{
			question: "What documents do I need to upload?",
			answer: "You will need to upload all relevant medical documents such as bills, prescriptions, test reports, and discharge summaries.",
		},
		{
			question: "Can I upload scanned documents?",
			answer: "Yes, you can upload both text-based and scanned documents. Our system can process both formats.",
		},
		{
			question: "How long does it take to process a claim?",
			answer: "Claim processing times vary depending on the complexity of the claim. However, Smart-Insure is designed to significantly reduce processing time compared to traditional methods.",
		},
		{
			question: "Will I be notified of the claim status?",
			answer: "Yes, you will be notified by your insurance provider once a decision has been made on your claim. You can also check the status on our website.",
		},
	];

	const howToUse = [
		"1. Initiate a Claim: Start by clicking on the 'Initiate Claim' button on our homepage or navbar.",
		"2. Fill in Details: Provide essential information such as patient name, hospital name, and policy number.",
		"3. Upload Documents: Attach all necessary medical documents in either text or scanned format. Specify the document type for efficient processing.",
		"4. Submit Claim: Once all information and documents are uploaded, submit your claim for review.",
		"5. Await Notification: You will be contacted by your insurance provider regarding the claim status.",
		"6. Check Claim Status: For updates, you can log in to your Smart-Insure account to check the status of your claim."
	];


	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice"
		}
	};

	const [activeIndex, setActiveIndex] = useState(null);

	const toggleFAQ = (index) => {
		setActiveIndex(index === activeIndex ? null : index);
	};

	return (
		<div className='content-center'>
			<Hero />
			<div className='flex justify-center items-center md:flex-row mx-10'>
				<div className='hidden md:block'>
					<Lottie
						options={defaultOptions}
						height={400}
						width={400}
					/>
				</div>
				<div className='flex flex-col mx-3 md:mx-10 space-y-5 mt-20 md:w-1/2 justify-center'>
					<h1 className='text-left text-2xl font-semibold '>Smart-Insure: Faster, Smarter Claim Processing</h1>
					<p className='text-left text-xl'>{homePagePara1}</p>
					<p className='text-left text-xl italic'>{homePagePara2}</p>
				</div>
			</div>
			<div className='flex justify-center items-center mt-20 mx-10 md:mx-60 content-center border-2 border-color-blue  rounded-lg py-6 '>
				<div className='flex flex-col w-10/12'>
					<h1 className='text-2xl font-semibold mb-6'>How to use Smart-Insure</h1>
					<ol className='space-y-5 text-pretty'>
						{howToUse.map((step) => (
							<li className='text-left text-lg font-light' key={step.key}>{step}</li>
						))}
					</ol>

				</div>

			</div>
			<div className='flex justify-center'>
				{userState.role === 'POLICY_HOLDER' &&
					<button className='bg-color-dark text-white py-4 px-10 rounded-full hover:bg-color-blue mt-10'
						onClick={() => navigate(`/new-claim`)}>Start your Claim</button>}
				{userState.role === 'CLAIM_ASSESSOR' &&
					<button className='bg-color-dark text-white py-4 px-10 rounded-full hover:bg-color-blue mt-10'
						onClick={() => navigate(`/my-profile`)}>View pending claims</button>}
			</div>

			<div className="w-3/4 mx-auto px-4 py-8 mt-10">
				<h2 className="text-2xl font-semibold text-center mb-8 mt-10">Frequently Asked Questions</h2>
				<div className="space-y-4">
					{faqs.map((faq, index) => (
						<div key={index} className="border border-color-blue hover:bg-color-dark hover:text-white p-4 rounded-md">
							<h3 className="text-lg font-medium cursor-pointer" onClick={() => toggleFAQ(index)}>
								{faq.question}
							</h3>
							{activeIndex === index && <p className="mt-2">{faq.answer}</p>}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default HomePage