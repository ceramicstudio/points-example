// Navbar.js
import React from "react";
import Image from "next/image";

const Navbar = () => {

  return (
    <nav className="w-full border-b border-slate-600 bg-white p-4 bg-gradient-to-b from-[#0f0f0f] to-[#1e1e1e]"  >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="flex flex-row mb-2">
                <div className="aspect-square">
                  <Image
                    src="https://developers.ceramic.network/img/logo.svg"
                    width={30}
                    height={30}
                    alt="Ceramic Logo"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="ml-3 text-lg font-bold text-white">
                    <a
                      href="/leaderboard"
                      className="text-lg font-bold text-white"
                    >
                      Points Demo Application
                    </a>
                  </div>
                </div>
              </div>
            </div>
      
        </div>

        <div className="hidden space-x-4 md:flex">
            <w3m-button size="sm" balance="hide" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
