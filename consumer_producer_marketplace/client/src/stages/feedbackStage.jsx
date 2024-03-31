/*
    This file contains the feedback stage for the consumer and producer roles.
    ConsumerFeedbackCard is used to display the feedback to the consumer.
    ProducerFeedbackCard is used to display the feedback to the producer.
    handleButtonClick is used to handle the button click.
    handleClaims is used to handle the claims.
    handleChallenges is used to handle the challenges.
    getQualityMatchEmoji is used to get the quality match emoji.
    player.get("role") is used to get the role of the player.
    player.get("wallet") is used to get the wallet of the consumer.
    player.get("challenges") is used to get the challenges of the consumer.
    player.get("claims") is used to get the claims of the producer.
    player.get("score") is used to get the score of the player.
    player.round.set("challengeAmount", challengeAmount) is used to set the challenge amount of the consumer.
    player.set("wallet", wallet) is used to set the wallet of the consumer.
    player.set("challenges", challenges) is used to set the challenges of the consumer.
    player.set("claims", claims) is used to set the claims of the producer.
    player.set("basket", basket) is used to set the basket of the consumer.
    player.stage.set("submit", true) is used to submit the stage and move to the next stage.
*/


import React, { useState } from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import { toast } from "react-toastify";


const showPopup = (message, color) => {
    return (
        <div className={`p-4 text-white ${color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}>
            <strong>{message}</strong>
        </div>
    );
};

export function FeedbackStage() {
    const player = usePlayer();
    // const players = usePlayers();
    const role = player.get("role");
    const roundHook = useRound();
    const round = roundHook.get("name");

    // else 
    if (role === "producer") {
        const handleProceed = () => {
            player.stage.set("submit", true);
        };

        const renderProducerFeedback = () => {

            const stock = player.get("stock")
            const productQuality = stock.find((item) => item.round === round).productQuality;
            const productAdQuality = stock.find((item) => item.round === round).productAdQuality;
            const productPrice = stock.find((item) => item.round === round).productPrice;
            const productCost = stock.find((item) => item.round === round).productCost;
            const capital = player.get("capital")
            const soldStock = stock.find((item) => item.round === round).soldStock;
            const initialStock = stock.find((item) => item.round === round).initialStock;
            const profit = soldStock * productPrice - (initialStock * productCost);

            return (
                <div className="text-center p-4 bg-white rounded-lg shadow-md max-w-[600px] mx-auto border-8 border-gray-100">
                    <h2 className="text-2xl mb-6 font-semibold flex items-center justify-center">
                        <img src="https://i.pinimg.com/originals/8f/9f/76/8f9f76391315ee0b33d9b17981ee8ce0.gif" alt="timer" className="w-6 h-6 mr-2" />
                        Producer Summary
                        <img src="https://i.pinimg.com/originals/8f/9f/76/8f9f76391315ee0b33d9b17981ee8ce0.gif" alt="timer" className="w-6 h-6 ml-2" />
                    </h2>
                    <hr className="border-t border-gray-300 my-4" />
                    {
                        soldStock > 0
                            ? showPopup(
                                `Your strategy worked! You sold ${soldStock} products to make a profit of $${profit.toFixed(2)}`,
                                "green"
                            )
                            : showPopup("Your strategy failed! You sold no products.", "red")
                    }
                    <div className="mt-6">
                        <p><span role="img" aria-label="factory">🏭</span> You produced {initialStock} <b>{productQuality.charAt(0).toUpperCase() + productQuality.slice(1)}</b> quality products and advertised it as <b>{productAdQuality.charAt(0).toUpperCase() + productAdQuality.slice(1)}</b> quality!</p>
                        <p><span role="img" aria-label="shopping-cart">🛒</span> Consumers bought <b>{soldStock}</b> unit(s) of your product at <b>${productPrice}</b> each!</p>
                        <p><span role="img" aria-label="money-bag">💰</span> This resulted in a total profit of: <b>${profit.toFixed(2)}</b></p>
                        <br />
                        <p><span role="img" aria-label="trophy">🏆</span> Your score this round is your profits (<b>${profit}</b>).</p>
                        <br />
                        <p className="text-lg" style={{ fontFamily: "'Archivo', sans-serif" }}>Your unused capital is: <b>${capital}</b></p>
                    </div>
                </div>
            );
        };
        return (
            <div className="text-center mt-8 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-md max-w-[700px] mx-auto my-4">
                <br />
                {renderProducerFeedback()}
                <br />
                <button className="mb-4 mt-1 bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md" onClick={handleProceed}>Proceed to next stage</button>
            </div>
        );
    }
    else {
        return (
            <div>
                <h1>Feedback Stage</h1>
            </div>
        );
    }
};
