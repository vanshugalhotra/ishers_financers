import Link from "next/link";

const CustomLink = ({ href, children }) => {
  return (
    <Link href={href}>
      <span
        className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </span>
    </Link>
  );
};

export default CustomLink;
