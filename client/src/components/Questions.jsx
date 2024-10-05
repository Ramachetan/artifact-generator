import React from 'react';
import { Calculator, Server, GamepadIcon, LayoutDashboard, StickyNote, Lock } from 'lucide-react';



const Questions = [
    {
      description: "Interactive Calculator",
      question: "Can you help me build an interactive calculator with a user interface that supports basic arithmetic operations (addition, subtraction, multiplication, and division)? I'd like it to have a clean, modern design with clickable buttons for numbers and operations. The calculator should be able to handle decimal numbers, display the current calculation, and show the result. Can you also include features like a clear button, backspace functionality, and keyboard support for input? Additionally, how can we implement error handling for operations like division by zero?",
      icon: <Calculator size={16} />
    },
    {
      description: "Tic-Tac-Toe Game",
      question: "Could you guide me through creating a two-player Tic-Tac-Toe game with a graphical interface, win detection, and a restart option? I'd like the game board to be visually appealing with clear X and O markers. Can you show me how to implement turn-based gameplay, highlight the winning combination when a player wins, and handle draws? I'm also interested in adding features like keeping score across multiple games, allowing players to choose their markers (X or O), and possibly implementing an AI opponent for single-player mode. How would we structure the code to make it easy to extend with these features?",
      icon: <GamepadIcon size={16} />
    },
    {
      description: "Responsive Landing Page",
      question: "Can you assist me in designing a responsive landing page with a hero section, feature highlights, and a contact form that looks great on Sparklesh desktop and mobile devices? Use your imagination to create a visually appealing layout.",
      icon: <LayoutDashboard size={16} />
    },
    {
      description: "Notes Application",
      question: "Help me develop a simple notes application where users can create, edit, delete, and search through their notes, with data persistence using local storage. I'd like the interface to have a sidebar listing all notes and a main area for viewing and editing the selected note. Can you show me how to implement rich text editing features like bold, italic, and bullet points? I'm also interested in adding the ability to categorize notes with tags, sort notes by date or alphabetically, and implement a dark mode toggle. How can we structure the application to easily add future features like note sharing or cloud synchronization? Additionally, can you guide me on implementing an efficient search functionality that filters notes in real-time as the user types?",
      icon: <StickyNote size={16} />
    },
    {
        description: "Dashboard using Rest API",
        question: `I have transaction data from a bank API (https://api.sampleapis.com/fakebank/accounts) that I'd like to visualize in an attractive, interactive dashboard. The API response looks like this: [ { "transactionDate": "2015-12-31", "description": "All Purpose Spray", "category": "Other Services", "debit": 100.84, "credit": null, "id": 1 }, { "transactionDate": "2016-01-02", "description": "Dr. FlimFlam's miracle cream", "category": "Health Care", "debit": 59.99, "credit": null, "id": 2 }, { "transactionDate": "2016-12-29", "description": "Admiral Crunch", "category": "Merchandise", "debit": 87.94, "credit": null, "id": 186 }, { "transactionDate": "2016-12-30", "description": "Bachelor Chow", "category": "Dining", "debit": 7.41, "credit": null, "id": 187 } ] Please create a React component for an attractive and informative dashboard that includes the following features: A summary of total debits and credits A breakdown of expenses by category, visualized as a pie or bar chart A list of recent transactions, sortable by date, amount, and category A line chart showing spending trends over time A search or filter function to find specific transactions The dashboard should be responsive and use modern design principles. Please use the recharts library for data visualization and Tailwind CSS for styling. Can you create this dashboard component and explain the key features of your implementation?`,
        icon: <Server size={16} />
    },
    {
      description: "Password Generator",
      question: "Can you guide me through creating a password generator tool that allows users to customize the length, character set, and complexity of generated passwords? I'd like the tool to provide options for including uppercase and lowercase letters, numbers, symbols, and avoiding ambiguous characters. How can we ensure the generated passwords are secure and meet common password requirements? Additionally, I'm interested in adding features like password strength estimation, password history, and the ability to save or copy generated passwords. How can we structure the code to make it easy to add new password generation algorithms or user preferences?",
      icon: <Lock size={16} />
    }
  ];

export default Questions;