import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Notecard from "../../components/Cards/Notecard";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt8">
          <Notecard
            title="Meeting on 4th April"
            date="4th April 2025"
            content="Meeting is bound to happen"
            tags="#Meeting202"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />

          <Notecard
            title="Meeting on 4th April"
            date="4th April 2025"
            content="Meeting is bound to happen"
            tags="#Meeting202"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
          <Notecard
            title="Meeting on 4th April"
            date="4th April 2025"
            content="Meeting is bound to happen"
            tags="#Meeting202"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />

          <Notecard
            title="Meeting on 4th April"
            date="4th April 2025"
            content="Meeting is bound to happen"
            tags="#Meeting202"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />

          <Notecard
            title="Meeting on 4th April"
            date="4th April 2025"
            content="Meeting is bound to happen"
            tags="#Meeting202"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
