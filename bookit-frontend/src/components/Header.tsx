import React from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react'; // Assuming lucide-react is installed

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  const placeholderText = "Search experiences";
  return (
    <div
      className="w-full max-w-[340px] md:w-[340px] h-[42px] bg-[#EDEDED] rounded-sm opacity-100 flex items-center"
    >
      <input
        type="text"
        placeholder={placeholderText}
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full h-full
        pt-3 pr-4 pb-3 pl-4
        bg-transparent border-none
        text-gray-800
        focus:outline-none
        placeholder:font-inter
        placeholder:font-normal
        placeholder:text-[14px]
        placeholder:leading-[18px]
        placeholder:text-[#727272]"
      />
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header
      className="flex items-center justify-center
      w-full 
      h-16 md:h-[87px] 
      bg-[#F9F9F9] opacity-100 sticky top-0 z-10"
    >
      <div
        className="w-full h-full
        

        pt-2 md:pt-4 
        px-1 md:px-8 lg:px-16 xl:px-[124px] 
        pb-2 md:pb-4
        
        flex items-center justify-between
        
        shadow-md"
      >
        <div
          className="flex items-center justify-center w-[100px] 
          h-10 md:h-[55px] opacity-100 shrink-0"
        >
          <img src="/logo/HDlogo1.png" alt="logo.png" className="max-h-full max-w-full" />
        </div>

        <div
          className="flex items-center
          w-auto md:w-[443px]
          h-[42px] opacity-100
          
          gap-1 md:gap-4" 
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        >
          <SearchBarComponent
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />

          <button
            onClick={handleSearch}
            className="flex items-center justify-center
            w-[42px] h-[42px]
            md:w-[87px] md:h-[42px]
            bg-[#FFD643] rounded-lg opacity-100
            font-inter font-semibold text-sm text-gray-800
            transition duration-150 hover:bg-[#FFC000]
            shrink-0"
          >
            <span
              className="pt-3 pr-5 pb-3 pl-5 hidden md:inline"
            >
              Search
            </span>

            <Search className="h-5 w-5 md:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;