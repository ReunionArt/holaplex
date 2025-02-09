import { Menu, Popover, Transition } from '@headlessui/react';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import cx from 'classnames';
import { ExplorerIcon } from '../icons/Explorer';
import { SolscanIcon } from '../icons/Solscan';
import { Fragment, useEffect, useState } from 'react';

function MoreDropdown({ address }: { address: string }) {
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (linkCopied) {
      const timer = setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [linkCopied]);

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(`https://www.holaplex.com/nfts/${address}`);
    setLinkCopied(true);
  };
  return (
    <Popover as="div" className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={cx(
              'flex h-10 w-10 items-center justify-center rounded-full ',
              open ? 'bg-white' : ''
            )}
          >
            <FeatherIcon icon="more-horizontal" className={open ? 'stroke-black' : ''} />
          </Popover.Button>

          {open && (
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              as={Fragment}
            >
              <Popover.Panel
                static
                as="ul"
                className="absolute z-10 w-56 p-4 bg-gray-800 rounded shadow-lg right-5 top-12"
              >
                <li>
                  {linkCopied ? (
                    <div className="flex items-center">
                      <FeatherIcon icon="check" /> <span className="pl-5">Link copied</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleCopyClick}
                      className="flex items-center hover:text-gray-300"
                    >
                      <FeatherIcon icon="copy" />
                      <span className="pl-5">Copy link to NFT</span>
                    </button>
                  )}
                </li>
                <li>
                  <a
                    href={`https://explorer.solana.com/address/${address}`}
                    className="flex items-center hover:text-gray-300"
                    target="_blank"
                  >
                    <ExplorerIcon />
                    <span className="pl-5">View on Explorer</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://solscan.io/account/${address}`}
                    className="flex items-center hover:text-gray-300"
                    target="_blank"
                  >
                    <SolscanIcon />
                    <span className="pl-5">View on SolScan</span>
                  </a>
                </li>
              </Popover.Panel>
            </Transition>
          )}
        </>
      )}
    </Popover>
  );
}

export default MoreDropdown;
