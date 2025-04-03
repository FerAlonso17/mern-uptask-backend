export default function ErrorMessage({children} : {children: React.ReactNode}) {
    return (
      <div className="text-center -mt-1 mb-1.5  bg-red-50 text-red-600 font-bold p-2 uppercase text-xs">
          {children}
      </div>
    )
  }
  