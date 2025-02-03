const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col justify-between bg-black">
      <div className="flex-grow flex items-center justify-center">
        {children}
      </div>
      <div className="flex justify-between p-4 text-white text-sm font-light ">
        <div>@2025 - EKharcha. All rights reserved.</div>
        <div className="">
          Powered by <span className="text-xl font-bold">ThunderDevelops</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
