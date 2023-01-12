import React, { useState, useEffect, } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();
const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;

};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum)
                return alert('please install metamask');

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                //getAllTransactions();
            } else {
                console.log("no accounts found")
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new error('no ethereum object.')
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert('please install metamask');
            const accounts = await ethereum.request({ method: 'eth_requestAccounts', });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new error('no ethereum object.')
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert('please install metamask');

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount); //convert decimal amount to gwei hexa decimal amnt 

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',  //21000 gwei
                    value: parsedAmount._hex,  //0.001
                }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log('Loading - ${transactionHash.hash}');
            await transactionHash.wait();
            setIsLoading(false);
            console.log('Success - ${transactionHash.hash}');

            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());

        } catch (error) {
            console.log(error);
            throw new error('no ethereum object.')
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);


    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, sendTransaction, setFormData, handleChange }}>
            {children}
        </TransactionContext.Provider>
    );
}