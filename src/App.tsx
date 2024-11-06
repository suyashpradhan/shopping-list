import {Fragment, useState} from 'react'
import {Dialog, Disclosure, Menu, MenuButton, MenuItem, MenuItems, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {ChevronDownIcon, PlusIcon} from '@heroicons/react/20/solid'
import {useFetchProducts} from "./services/useFetchProducts";
import {Product} from "./types/Product";

const filters = [
    {
        id: 'category',
        name: 'Category',
        options: [
            {value: 'electronics', label: 'Electronics'},
            {value: 'jewelery', label: 'Jewelery'},
            {value: 'men\'s clothing', label: 'Men\'s clothing'},
            {value: 'women\'s clothing', label: 'Women\'s clothing'},
        ],
    },
]

const sortOptions = [
    {name: 'Price: Low to High', href: '#', value: 'asc', current: false},
    {name: 'Price: High to Low', href: '#', value: 'desc', current: false},
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

function App() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [selectedSortOptions, setSelectedSortOptions] = useState('asc')

    const {products, loading, error} = useFetchProducts()

    if (loading === 'loading') return <p>loading...</p>
    if (error) return <p>error</p>

    const sortedProducts = [...products].sort((a: Product, b: Product) => {
        if (selectedSortOptions === 'asc') {
            return a.price - b.price
        } else {
            return b.price - a.price
        }
    })

    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25"/>
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel
                                    className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4">
                                        {filters.map((section) => (
                                            <Disclosure as="div" key={section.name}
                                                        className="border-t border-gray-200 pt-4 pb-4">
                                                {({open}) => (
                                                    <fieldset>
                                                        <legend className="w-full px-2">
                                                            <Disclosure.Button
                                                                className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                                                <span
                                                                    className="text-sm font-medium text-gray-900">{section.name}</span>
                                                                <span className="ml-6 flex h-7 items-center">
                                  <ChevronDownIcon
                                      className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                      aria-hidden="true"
                                  />
                                </span>
                                                            </Disclosure.Button>
                                                        </legend>
                                                        <Disclosure.Panel className="px-4 pt-4 pb-2">
                                                            <div className="space-y-6">
                                                                {section.options.map((option, optionIdx) => (
                                                                    <div key={option.value}
                                                                         className="flex items-center">
                                                                        <input
                                                                            id={`${section.id}-${optionIdx}-mobile`}
                                                                            name={`${section.id}[]`}
                                                                            defaultValue={option.value}
                                                                            type="checkbox"
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`${section.id}-${optionIdx}-mobile`}
                                                                            className="ml-3 text-sm text-gray-500"
                                                                        >
                                                                            {option.label}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Disclosure.Panel>
                                                    </fieldset>
                                                )}
                                            </Disclosure>
                                        ))}
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-screen-2xl lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton
                                        className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        {sortOptions.find((option) => option.value === selectedSortOptions)?.name || 'Sort'}
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="-mr-1 ml-1 h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                                        />
                                    </MenuButton>
                                </div>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.name}>
                                                <a
                                                    onClick={() => setSelectedSortOptions(option.value)}
                                                    href={option.href}
                                                    className={classNames(
                                                        option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                        'block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none',
                                                    )}
                                                >
                                                    {option.name}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>

                    <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                        <aside>
                            <h2 className="sr-only">Filters</h2>

                            <button
                                type="button"
                                className="inline-flex items-center lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="text-sm font-medium text-gray-700">Filters</span>
                                <PlusIcon className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                                          aria-hidden="true"/>
                            </button>

                            <div className="hidden lg:block">
                                <form className="space-y-10 divide-y divide-gray-200">
                                    {filters.map((section, sectionIdx) => (
                                        <div key={section.name}
                                             className={sectionIdx === 0 ? undefined : 'pt-10'}>
                                            <fieldset>
                                                <legend
                                                    className="block text-sm font-medium text-gray-900">{section.name}</legend>
                                                <div className="space-y-3 pt-6">
                                                    {section.options.map((option, optionIdx) => (
                                                        <div key={option.value} className="flex items-center">
                                                            <input
                                                                id={`${section.id}-${optionIdx}`}
                                                                name={`${section.id}[]`}
                                                                defaultValue={option.value}
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <label htmlFor={`${section.id}-${optionIdx}`}
                                                                   className="ml-3 text-sm text-gray-600">
                                                                {option.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </fieldset>
                                        </div>
                                    ))}
                                </form>
                            </div>
                        </aside>

                        {/* Product grid */}
                        <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
                            <div className="h-96 border-l-2 border-solid px-4 border-gray-200 lg:h-full">
                                <div
                                    className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                                    {sortedProducts.map((product) => (
                                        <div key={product.id}>
                                            <div className="relative">
                                                <div
                                                    className="relative h-72 w-full overflow-hidden rounded-lg">
                                                    <img
                                                        src={product.image}
                                                        alt={product.image}
                                                        className="h-full w-full object-contain object-center"
                                                    />
                                                </div>
                                                <div className="relative mt-4">
                                                    <h3 className="text-sm h-12 font-medium text-gray-900">{product.title}</h3>
                                                </div>
                                                <div
                                                    className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                                                    <div
                                                        aria-hidden="true"
                                                        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                                                    />
                                                    <p className="relative text-lg font-semibold text-white">{product?.price}</p>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <a
                                                    href={product.title}
                                                    className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 py-2 px-8 text-sm font-medium text-gray-900 hover:bg-gray-200"
                                                >
                                                    Add to bag<span className="sr-only">, {product.title}</span>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;

