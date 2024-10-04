import React from 'react';
import { Calculator, GamepadIcon, LayoutDashboard, StickyNote } from 'lucide-react';



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
    }
  ];

export default Questions;