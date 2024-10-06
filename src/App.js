import React, { useState } from 'react';
import './App.css'; 
const initialFriends = [
    {
        id:11233,
        name: "Clerk",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: 0
    },
    {
        id:11234,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 0
    },
    {
        id:11235,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0
    }
]
function Button({children,onClick}){
    return <button className='button' onClick={onClick}>{children}</button>
}
/////////////////////////////////////////////////////////////////////////////////////////////////
function App() {
    const [friends, setFriends] = useState(initialFriends)
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState(null)
    function handleAddFriend(friend){
        setFriends((friends)=> [...friends,friend])
        setShowAddFriend(false);
    }
    function handleSelection(friend){
        // setSelectedFriend(friend)
        setSelectedFriend((cur)=>cur?.id === friend.id ? null : friend)
        setShowAddFriend(false)
    }

    function handleSplitBill(value){
        console.log(value)
        setFriends((friends)=>
        friends.map((friend)=> 
        friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value}
        : friend
        )
        );
    }
    
  return (
    <>
    <div className='header'> <Header/></div>
   
    <div className='app'>
        <div className='sidebar'>
            <FriendList 
            friends = {friends} 
            onSelection={handleSelection} 
            selectedFriend={selectedFriend}/>

            {showAddFriend && <FormAddFriend 
            onAddFriend={handleAddFriend}/>}
        
            <Button onClick={()=>setShowAddFriend(show=>!show)}>{showAddFriend ? `Close` : `Add friend`}</Button>
        </div>
        { selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/>}
    </div>  
    </>
  );
}

function FriendList({friends, onSelection, selectedFriend}){
    // const friends = initialFriends;
    return (
        <ul>
            {friends.map((friend)=>(
                <Friend 
                friend={friend} 
                key={friend.id} 
                onSelection={onSelection}
                selectedFriend={selectedFriend}/> // pass friend as prop for separate function
            ))}
        </ul>
    );
}

function Friend({friend, onSelection, selectedFriend}){
    const isSelected = selectedFriend?.id === friend.id;
    
    return (
        <li className={isSelected ? "selected" : ""}>
            <img src={friend.image} alt={friend.name}/>
            <h3>{friend.name}</h3>
            {/* // for owe */}
            {friend.balance < 0 && (
                <p className='red'>You owe {friend.name} ${Math.abs(friend.balance)}</p>
            )}
            {/* // for lent */}
            {friend.balance > 0 && (
                <p className='green'>{friend.name} owes you ${Math.abs(friend.balance)}</p>
            )}
            {/* // for balance */}
            {friend.balance === 0 && 
            <p>You and {friend.name} are even</p>
            }

            <Button onClick={()=> onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
        </li>
    );
}


function FormAddFriend({ onAddFriend }) {
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://i.pravatar.cc/48");

    function handleSubmit(e) {
        e.preventDefault();
        if (!name || !image) return;

        const id = crypto.randomUUID(); // Generate a unique ID for each friend
        const newFriend = {
            id,
            name,
            image: `${image}?u=${id}`, // Fix string interpolation for the image URL
            balance: 0,
        };

        onAddFriend(newFriend);
        console.log(newFriend)

        setName(''); // Reset name input
        setImage('https://i.pravatar.cc/48'); // Reset image input
    }

    return (
        <form className="form-add-friend" onSubmit={handleSubmit}>
            <h4>Friend Name</h4>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <h4>Image Url</h4>
            <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            <Button>Add</Button>
        </form>
    );
}


function FormSplitBill({ selectedFriend, onSplitBill }) {
    const [bill, setBill] = useState("");
    const [paidByUser, setPaidByUser] = useState('');
    const paidByFriend = bill ? bill - paidByUser : "";
    const [whoIsPaying, setWhoIsPaying] = useState("user");

    function handleSubmit(e) {
        e.preventDefault();
        // you pay whole amount of your friend or total amount you owe from your frd.
        if (!bill || paidByUser === "" || paidByFriend === "") {
            alert("Please fill in both the bill and your expense.");
            return;
        }

        const value = whoIsPaying === 'user' ? paidByFriend : -paidByUser;
        onSplitBill(value);
    }

    return (
        <form className='form-split-bill' onSubmit={handleSubmit}>
            <h2>Split the bill with {selectedFriend.name}</h2>
            
            <h4>Bill value</h4>
            <input 
                type='text' 
                value={bill} 
                onChange={(e)=> setBill(Number(e.target.value))} 
                placeholder='bill value'
                
            />

            <h4>Your expense</h4>
            <input 
                type='text' 
                value={paidByUser}
                onChange={(e)=> setPaidByUser(Number(e.target.value))} 
                placeholder='Your bill'
            />

            <h4>{selectedFriend.name}'s expense</h4>
            <input 
                type='text' 
                disabled 
                value={paidByFriend} 
                placeholder="friend's bill"
                
            />

            <h4>Who is paying the bill</h4>
            <select 
                value={whoIsPaying} 
                onChange={(e)=> setWhoIsPaying(e.target.value)}
            >
                <option value="user">You</option>
                <option value="friend">{selectedFriend.name}</option>
            </select>

            <Button>Split bill</Button>
        </form>
    );
}


function Header(){
    return (
        <>
        <h1><u>Share Split</u></h1>
        </>
    );
}













export default App;
